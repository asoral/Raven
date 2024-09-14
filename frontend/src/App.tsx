import { FrappeProvider } from 'frappe-react-sdk'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { ProtectedRoute } from './utils/auth/ProtectedRoute'
import { UserProvider } from './utils/auth/UserProvider'
import { ChannelRedirect } from './utils/channel/ChannelRedirect'
import "cal-sans";
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from 'sonner'
import { useStickyState } from './hooks/useStickyState'
import MobileTabsPage from './pages/MobileTabsPage'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' lazy={() => import('@/pages/auth/Login')} />
      <Route path='/login-with-email' lazy={() => import('@/pages/auth/LoginWithEmail')} />
      <Route path='/signup' lazy={() => import('@/pages/auth/SignUp')} />
      <Route path='/forgot-password' lazy={() => import('@/pages/auth/ForgotPassword')} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<ChannelRedirect />}>
          <Route path="channel" element={<MainPage />} >
            <Route index element={<MobileTabsPage />} />
            <Route path="threads" lazy={() => import('./components/feature/threads/Threads')}>
              <Route path="thread/:threadID" lazy={() => import('./components/feature/threads/ThreadDrawer/ThreadDrawer')} />
            </Route>
            <Route path="saved-messages" lazy={() => import('./components/feature/saved-messages/SavedMessages')} />
            <Route path="settings" lazy={() => import('./pages/settings/Settings')}>
              <Route index lazy={() => import('./components/feature/userSettings/UserProfile/UserProfile')} />
              <Route path="profile" lazy={() => import('./components/feature/userSettings/UserProfile/UserProfile')} />
              <Route path="users" lazy={() => import('./components/feature/userSettings/Users/AddUsers')} />
              <Route path="hr" lazy={() => import('./pages/settings/Integrations/FrappeHR')} />
              <Route path="bots" >
                <Route index lazy={() => import('./pages/settings/AI/BotList')} />
                <Route path="create" lazy={() => import('./pages/settings/AI/CreateBot')} />
                <Route path=":ID" lazy={() => import('./pages/settings/AI/ViewBot')} />
              </Route>

              <Route path="functions">
                <Route index lazy={() => import('./pages/settings/AI/FunctionList')} />
                <Route path="create" lazy={() => import('./pages/settings/AI/CreateFunction')} />
              </Route>


              <Route path="instructions">
                <Route index lazy={() => import('./pages/settings/AI/InstructionTemplateList')} />
                <Route path="create" lazy={() => import('./pages/settings/AI/CreateInstructionTemplate')} />
                <Route path=":ID" lazy={() => import('./pages/settings/AI/ViewInstructionTemplate')} />
              </Route>

              <Route path="commands">
                <Route index lazy={() => import('./pages/settings/AI/SavedPromptsList')} />
                <Route path="create" lazy={() => import('./pages/settings/AI/CreateSavedPrompt')} />
                <Route path=":ID" lazy={() => import('./pages/settings/AI/ViewSavedPrompt')} />
              </Route>

              <Route path="openai-settings" lazy={() => import('./pages/settings/AI/OpenAISettings')} />
            </Route>
            <Route path=":channelID" lazy={() => import('@/pages/ChatSpace')}>
              <Route path="thread/:threadID" lazy={() => import('./components/feature/threads/ThreadDrawer/ThreadDrawer')} />
            </Route>
          </Route>
          {/* <Route path='settings' lazy={() => import('./pages/settings/Settings')}>
            <Route path='integrations'>
              <Route path='webhooks' lazy={() => import('./pages/settings/Webhooks/WebhookList')} />
              <Route path='webhooks/create' lazy={() => import('./pages/settings/Webhooks/CreateWebhook')} />
              <Route path='webhooks/:ID' lazy={() => import('./pages/settings/Webhooks/ViewWebhook')} />
              <Route path='scheduled-messages' lazy={() => import('./pages/settings/ServerScripts/SchedulerEvents/SchedulerEvents')} />
              <Route path='scheduled-messages/create' lazy={() => import('./pages/settings/ServerScripts/SchedulerEvents/CreateSchedulerEvent')} />
              <Route path='scheduled-messages/:ID' lazy={() => import('./pages/settings/ServerScripts/SchedulerEvents/ViewSchedulerEvent')} />
            </Route>
          </Route> */}
        </Route>
      </Route>
    </>
  ), {
  basename: `/${import.meta.env.VITE_BASE_NAME}` ?? '',
}
)
function App() {

  const [appearance, setAppearance] = useStickyState<'light' | 'dark'>('dark', 'appearance');

  const toggleTheme = () => {
    setAppearance(appearance === 'dark' ? 'light' : 'dark');
  };

  // We need to pass sitename only if the Frappe version is v15 or above.

  const getSiteName = () => {
    // @ts-ignore
    if (window.frappe?.boot?.versions?.frappe && (window.frappe.boot.versions.frappe.startsWith('15') || window.frappe.boot.versions.frappe.startsWith('16'))) {
      // @ts-ignore
      return window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME
    }
    return import.meta.env.VITE_SITE_NAME

  }

  return (
    <FrappeProvider
      url={import.meta.env.VITE_FRAPPE_PATH ?? ''}
      socketPort={import.meta.env.VITE_SOCKET_PORT ? import.meta.env.VITE_SOCKET_PORT : undefined}
      //@ts-ignore
      swrConfig={{
        provider: localStorageProvider
      }}
      siteName={getSiteName()}
    >
      <UserProvider>
        <Toaster richColors />
        <ThemeProvider
          appearance={appearance}
          // grayColor='slate'
          accentColor='iris'
          panelBackground='translucent'
          toggleTheme={toggleTheme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </UserProvider>
    </FrappeProvider>
  )
}

function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, any>(JSON.parse(localStorage.getItem('app-cache') || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  // We still use the map for write & read for performance.
  return map
}

export default App