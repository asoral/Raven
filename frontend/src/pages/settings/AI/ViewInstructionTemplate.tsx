import { Loader } from "@/components/common/Loader"
import InstructionTemplateForm from "@/components/feature/settings/ai/InstructionTemplateForm"
import { ErrorBanner } from "@/components/layout/AlertBanner"
import { FullPageLoader } from "@/components/layout/Loaders"
import PageContainer from "@/components/layout/Settings/PageContainer"
import SettingsContentContainer from "@/components/layout/Settings/SettingsContentContainer"
import SettingsPageHeader from "@/components/layout/Settings/SettingsPageHeader"
import { RavenBotInstructionTemplate } from "@/types/RavenAI/RavenBotInstructionTemplate"
import { Button } from "@radix-ui/themes"
import { useFrappeGetDoc, useFrappeUpdateDoc } from "frappe-react-sdk"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const ViewInstructionTemplate = () => {

    const { ID } = useParams<{ ID: string }>()

    const { data, isLoading, error } = useFrappeGetDoc<RavenBotInstructionTemplate>("Raven Bot Instruction Template", ID)

    return (
        <PageContainer>
            <ErrorBanner error={error} />
            {isLoading && <FullPageLoader className="h-64" />}
            {data && <ViewBotContent data={data} />}
        </PageContainer>
    )
}

const ViewBotContent = ({ data }: { data: RavenBotInstructionTemplate }) => {

    const { updateDoc, loading, error } = useFrappeUpdateDoc<RavenBotInstructionTemplate>()

    const methods = useForm<RavenBotInstructionTemplate>({
        disabled: loading,
        defaultValues: data
    })


    const onSubmit = (data: RavenBotInstructionTemplate) => {
        updateDoc("Raven Bot Instruction Template", data.name, data)
            .then((doc) => {
                toast.success("Saved")
                methods.reset(doc)
            })
    }

    return <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
            <SettingsContentContainer>
                <SettingsPageHeader
                    title={data.name}
                    actions={<Button type='submit' disabled={loading}>
                        {loading && <Loader />}
                        {loading ? "Saving" : "Save"}
                    </Button>}
                    breadcrumbs={[{ label: 'Instruction Templates', href: '../' }, { label: data.name, href: '', copyToClipboard: true }]}
                />
                <ErrorBanner error={error} />
                <InstructionTemplateForm isEdit />
            </SettingsContentContainer>
        </FormProvider>
    </form>

}

export const Component = ViewInstructionTemplate