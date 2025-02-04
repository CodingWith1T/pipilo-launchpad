import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiconfig } from './wagmiconfig/wagmiconfig';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

const queryClient = new QueryClient();
const customTheme = darkTheme({
  borderRadius: 'medium',
  overlayBlur: 'small',
  fontStack: 'system',
  modalWidth: 'auto',  // This will ensure that modal width adjusts responsively
  accentColor: '#4a90e2', // Customize accent color
});
function App() {
  return (
    <WagmiProvider config={wagmiconfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <div className="App">
            <Navbar />
            <div className="App-content">
              <Outlet />
            </div>
            <Footer />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
