import { Label, ErrorText, HelperText } from '@/components/common/Form'
import { Stack, HStack } from '@/components/layout/Stack'
import { RavenBot } from '@/types/RavenBot/RavenBot'
import { Box, TextField, Checkbox, Text, Separator, Tooltip } from '@radix-ui/themes'
import { useFormContext, Controller } from 'react-hook-form'
import { BiInfoCircle } from 'react-icons/bi'

type Props = {}

const AIFeaturesBotForm = (props: Props) => {
    const { register, control, formState: { errors }, watch } = useFormContext<RavenBot>()

    const isAiBot = watch('is_ai_bot')

    const openAIAssistantID = watch('openai_assistant_id')

    return (
        <Stack gap='4'>
            <Stack maxWidth={'480px'}>
                <Box hidden={!openAIAssistantID}>
                    <Label htmlFor='openai_assistant_id'>OpenAI Assistant ID</Label>
                    <TextField.Root
                        id='openai_assistant_id'
                        {...register('openai_assistant_id')}
                        readOnly
                        placeholder="asst_*******************"
                        aria-invalid={errors.openai_assistant_id ? 'true' : 'false'}
                    />
                </Box>
                {errors.openai_assistant_id && <ErrorText>{errors.openai_assistant_id?.message}</ErrorText>}
            </Stack>
            <Stack maxWidth={'480px'}>
                <Text as="label" size="2">
                    <HStack>
                        <Controller
                            control={control}
                            name='allow_bot_to_write_documents'
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value ? true : false}
                                    onCheckedChange={(v) => field.onChange(v ? 1 : 0)}
                                />
                            )} />

                        Allow Bot to Write Documents
                    </HStack>
                </Text>
                <HelperText>
                    Checking this will allow the bot to create/update/delete documents in the system.
                </HelperText>
            </Stack>
            <Stack maxWidth={'480px'}>
                <Text as="label" size="2">
                    <HStack align='center'>
                        <Controller
                            control={control}
                            name='enable_file_search'
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value ? true : false}
                                    onCheckedChange={(v) => field.onChange(v ? 1 : 0)}
                                />
                            )} />
                        <span>Enable File Search</span>
                        <Tooltip content='View OpenAI documentation about File Search'>
                            <a href='https://platform.openai.com/docs/assistants/tools/file-search'
                                title='View OpenAI documentation about File Search'
                                aria-label='View OpenAI documentation about File Search'
                                target='_blank' className='text-gray-11 -mb-1'>
                                <BiInfoCircle size={16} /></a>
                        </Tooltip>

                    </HStack>
                </Text>
                <HelperText>
                    Enable this if you want the bot to be able to read files and scan them.
                    <br /><br />
                    File search enables the assistant with knowledge from files that you upload.
                    <br /><br />
                    Once a file is uploaded, the assistant automatically decides when to retrieve content based on user requests.
                </HelperText>
            </Stack>
            <Separator className='w-full' />

        </Stack>
    )
}

export default AIFeaturesBotForm