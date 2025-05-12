'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ConnectWallet.module.css';
import NftModal from './NftModal';

// Contract address
const contractAddress = '0x2781d8fb4cf986547cc418a583908bfe92dbd8e5';

// Simpler ABI with just the functions we need
const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "tokensOfOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8462151c"
  }
];

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const [tokenIds, setTokenIds] = useState([]);
  const [hasNFTs, setHasNFTs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get balance data
  const { data: balance } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });
  
  // Try to fetch tokens using the hook directly
  const { data: tokensData, isLoading: tokensLoading } = useReadContract({
    address: contractAddress, 
    abi,
    functionName: 'tokensOfOwner',
    args: address ? [address] : undefined,
    enabled: isConnected && !!address,
  });

  // Fetch tokens of owner
  useEffect(() => {
    const fetchTokenIds = async () => {
      if (!isConnected || !address) return;
      
      setLoading(true);
      setError(null);
      console.log("Connected wallet address:", address);
      
      // First check if we got data from the useReadContract hook
      if (tokensData && Array.isArray(tokensData) && tokensData.length > 0) {
        try {
          console.log("tokensOfOwner data from hook:", tokensData);
          const ids = tokensData.map(id => 
            typeof id === 'bigint' ? id.toString() : String(id)
          );
          setTokenIds(ids);
          setHasNFTs(true);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Error processing hook data:", e);
        }
      }
      
      try {
        // Create a public client without relying on wagmi's getPublicClient
        const publicClient = createPublicClient({
          chain: mainnet,
          transport: http()
        });
        
        // Try direct call using the function selector
        try {
          console.log("Trying tokensOfOwner with function selector 0x8462151c...");
          
          const data = await publicClient.call({
            to: contractAddress,
            data: `0x8462151c000000000000000000000000${address.slice(2).toLowerCase()}`,
          });
          
          console.log("Raw tokensOfOwner response:", data);
          
          if (data.data) {
            const hexData = data.data;
            
            // If the response starts with 0x and has data, try to parse it
            if (hexData && hexData.startsWith('0x') && hexData.length > 66) {
              try {
                // First 32 bytes after 0x (64 chars) are the offset to the array
                // Next 32 bytes are the array length
                const arrayLengthHex = hexData.slice(2 + 64, 2 + 64 + 64);
                const arrayLength = parseInt(arrayLengthHex, 16);
                
                if (arrayLength > 0 && arrayLength < 1000) { // Sanity check
                  console.log(`Detected array of length ${arrayLength}`);
                  
                  const ids = [];
                  for (let i = 0; i < arrayLength; i++) {
                    const startPos = 2 + 64 + 64 + (i * 64);
                    const idHex = hexData.slice(startPos, startPos + 64);
                    const id = parseInt(idHex, 16).toString();
                    ids.push(id);
                  }
                  
                  console.log("Decoded token IDs:", ids);
                  
                  if (ids.length > 0) {
                    setTokenIds(ids);
                    setHasNFTs(true);
                    setLoading(false);
                    return;
                  }
                }
              } catch (e) {
                console.error("Error decoding hexData:", e);
              }
            }
          }
        } catch (e) {
          console.error("Error with direct function call:", e);
        }
        
        // If we get here and have a balance, show it
        if (balance) {
          const tokenCount = Number(balance);
          console.log("Balance result:", tokenCount);
          
          if (tokenCount > 0) {
            setHasNFTs(true);
            setTokenIds([`You own ${tokenCount} MiLego NFTs`]);
          } else {
            setHasNFTs(false);
            setTokenIds([]);
          }
        } else {
          setError("Failed to retrieve your NFTs");
        }
      } catch (error) {
        console.error('Error fetching token IDs:', error);
        setError('Error fetching your NFTs');
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address) {
      fetchTokenIds();
    }
  }, [address, isConnected, tokensData, balance]);

  // Format token ID for URL (pad with leading zeros to 4 digits)
  const formatTokenId = (id) => {
    return String(id).padStart(4, '0');
  };
  
  // Handle opening the modal when clicking on an NFT
  const handleNftClick = (id) => {
    setSelectedNft(id);
    setIsModalOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} className={styles.connectButton}>
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} className={styles.wrongNetworkButton}>
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className={styles.connectedContainer}>
                    <button
                      onClick={openAccountModal}
                      className={styles.accountButton}
                    >
                      {account.displayName}
                    </button>
                    
                    <div className={styles.tokenList}>
                      <h3 className={styles.tokenTitle}>Your MiLego NFTs</h3>
                      
                      {(loading || tokensLoading) ? (
                        <p className={styles.loadingText}>Loading your NFTs... (this may take a moment)</p>
                      ) : error ? (
                        <p className={styles.error}>{error}</p>
                      ) : hasNFTs ? (
                        <>
                          {tokenIds.length === 1 && tokenIds[0].startsWith("You own") ? (
                            <p className={styles.balanceOnly}>{tokenIds[0]}</p>
                          ) : (
                            <ul className={styles.tokenGrid}>
                              {tokenIds.map((id, index) => {
                                const formattedId = formatTokenId(id);
                                return (
                                  <li key={index} className={styles.tokenItem}>
                                    {/* Main NFT card is now clickable to open the modal */}
                                    <div 
                                      className={styles.nftCard}
                                      onClick={() => handleNftClick(id)}
                                    >
                                      <div className={styles.thumbnailContainer}>
                                        <Image 
                                          src={`/milego/${formattedId}/${formattedId}_Render.png`}
                                          alt={`MiLego #${id}`}
                                          width={100}
                                          height={100}
                                          className={styles.thumbnail}
                                          priority={index < 4}
                                          onError={(e) => {
                                            e.currentTarget.src = `/milego/${formattedId}/${formattedId}_Render.jpg`;
                                            e.currentTarget.onerror = () => {
                                              e.currentTarget.src = `/milego/${formattedId}/${formattedId}.png`;
                                              e.currentTarget.onerror = null;
                                            };
                                          }}
                                        />
                                      </div>
                                      <span className={styles.tokenId}>#{id}</span>
                                    </div>
                                    
                                    {/* Independent View 3D button */}
                                    <Link 
                                      href={`/${formattedId}`} 
                                      className={styles.viewButton}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View 3D Model
                                    </Link>
                                    
                                    {/* Download links */}
                                    <div className={styles.downloadLinks}>
                                      <a 
                                        href={`/milego/${formattedId}/${formattedId}.vrm`} 
                                        download 
                                        className={styles.downloadButton}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        VRM
                                      </a>
                                      <a 
                                        href={`/milego/${formattedId}/${formattedId}.gltf`} 
                                        download 
                                        className={styles.downloadButton}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        GLTF
                                      </a>
                                      <a 
                                        href={`/milego/${formattedId}/${formattedId}.blend`} 
                                        download 
                                        className={styles.downloadButton}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        BLEND
                                      </a>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <p className={styles.noTokens}>You don't own any MiLego NFTs</p>
                      )}
                    </div>
                    
                    {/* Modal for displaying NFT details */}
                    {isModalOpen && selectedNft && (
                      <NftModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        tokenId={selectedNft}
                        formattedId={formatTokenId(selectedNft)}
                      />
                    )}
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
} 