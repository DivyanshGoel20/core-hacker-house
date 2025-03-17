import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useConnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useNavigate } from 'react-router-dom';

const WalletConnect: React.FC = () => {
  const { connect, status } = useConnect();
  const { address } = useAccount();
  const navigate = useNavigate();

  const checkProfile = async (walletAddress: string) => {
    const hasProfile = localStorage.getItem(`profile-${walletAddress}`);
    return !!hasProfile;
  };

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  React.useEffect(() => {
    const checkAndRedirect = async () => {
      if (address) {
        const hasProfile = await checkProfile(address);
        navigate(hasProfile ? '/dashboard' : '/create-profile');
      }
    };

    checkAndRedirect();
  }, [address, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl w-full"
      >
        <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Welcome to SocialFi
        </h1>
        <p className="text-xl mb-12 text-gray-300">
          Connect your wallet to enter the future of social networking
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={status === 'connecting'}
          className="mx-auto flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet size={24} />
          {status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WalletConnect;