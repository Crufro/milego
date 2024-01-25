//NeumorphicToggle.js
import React, { useState } from 'react';
import styles from '../app/Home.module.css'; // Assuming you create a corresponding CSS module

const NeumorphicToggle = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
    if (isToggled) {
      console.log('Light mode');
    } else {
      console.log('Dark mode');
    }
  };

  return (
    <div className={styles.toggleContainer} onClick={toggleSwitch}>
      <div className={`${styles.toggleCircle} ${isToggled ? styles.on : styles.off}`}></div>
    </div>
  );
};

export default NeumorphicToggle;
