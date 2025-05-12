// Page.js

import React from 'react';
import styles from './Home.module.css'; // Import the CSS module

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <img src="/images/banner.png" alt="MilegoMaker Logo" className={styles.logo} />
      <h1 className={styles.header}>MilegoMaker.net</h1>
      <img src="/images/MilegoMaker.gif" alt="Your GIF" className={styles.gif} />
      <p className={styles.centeredText}>This is neochibi + LEGO</p>
      <a href="https://www.scatter.art/milego-maker" target="_blank" rel="noopener noreferrer">
        <img src="/images/mint.png" alt="Mint Now" className={styles.mintNowImage} />
      </a>
      <div className={styles.linksContainer}>
        <a href="/gallery" className={styles.link}>Gallery</a>
        <a href="https://twitter.com/MilegoMaker" target="_blank" rel="noopener noreferrer" className={styles.link}>Twitter</a>
        <a href="https://etherscan.io/address/0x2781d8fb4cf986547cc418a583908bfe92dbd8e5" target="_blank" rel="noopener noreferrer" className={styles.link}>Contract</a>
      </div>
      <img src="/images/logo.png" alt="Fixed Logo" className={styles.fixedLogo} />
      <h2 className={styles.title}>3D Files Included!</h2>
      <p className={styles.text}>Every MiLego comes with original 3D assets and files packaged for use in Blender 3D software.</p>
      <div className={styles.imagesContainer}>
        <img src="/images/LegoAnnounce.png" alt="Image 1" className={styles.image} />
        <img src="/images/MilegoBlender.png" alt="Image 2" className={styles.image} />
      </div>

      {/* New Elements Below */}
      <h2 className={styles.subtitle}>Now Minting</h2>
      <img src="/images/DCIM_MilegoAlbum_12-17-1993.png" alt="Minting" className={styles.mintingImage} />
      <p className={styles.mintingText}>
        Purchase your MiLego NFT by Minting it on Scatter.art
        <br />
        <br />
        • If you hold special NFTs you might be eligible for a FREE MILEGO! (Terms and conditions may apply)
        <br />
        • Your MiLego will be delivered to your ETHEREUM wallet!
        <br />
        • To view your Milego, please log into Scatter.art or view the Gallery!
      </p>

      {/* Footer */}
      <footer className={styles.footer}>
        <a href="https://viralpubliclicense.org/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          VPL MiLego Maker
        </a>
        <img src="/images/privacyseal6.gif" alt="Small Image 1" className={styles.smallImage} />
        <img src="/images/truste_button.gif" alt="Small Image 2" className={styles.smallImage} />
      </footer>
    </div>
  );
}
