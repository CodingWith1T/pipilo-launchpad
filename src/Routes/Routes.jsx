import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../Pages/HomePage/HomePage";
import StandardLaunchpadCreate from "../Pages/StandardLaunchpadCreate/StandardLaunchpadCreate";
import FairLaunchpadCreate from "../Pages/FairLaunchpadCreate/FairLaunchpadCreate";
import LaunchpadsList from "../Pages/LaunchpadsList/LaunchpadsList";
import LaunchpadDetails from "../Pages/LaunchpadDetails/LaunchpadDetails";
import LockCreate from "../Pages/LockCreate/LockCreate";
import LockList from "../Pages/LockList/LockList";
import TokenCreate from "../Pages/TokenCreate/TokenCreate";
import Documents from "../Pages/Documents/Documents";
import Kyc from "../Pages/Kyc/Kyc";
import Lockdetails from "../Pages/Lockdetails/Lockdetails";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      {
        path: 'launchpads',
        children: [
          { path: 'launchpad', element: <StandardLaunchpadCreate /> },
          { path: 'fairlaunch', element: <FairLaunchpadCreate /> },
          { path: 'launchpad-list/:networkId?', element: <LaunchpadsList /> },
          { path: ':type/:launchpadId/:chainId', element: <LaunchpadDetails /> },
        ],
      },
      {
        path: 'lock',
        children: [
          { path: 'create', element: <LockCreate /> },
          { path: 'tokens', element: <LockList /> },
          { path: ':address', element: <Lockdetails /> },
        ],
      },
      { path: 'token', element: <TokenCreate /> },
      { path: 'documents', element: <Documents /> },
      { path: 'kyc', element: <Kyc /> }
    ],
  },
]);
