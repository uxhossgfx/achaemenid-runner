// Achaemenid Runner Game

import React, { useState, useEffect } from 'react';

const AchaemenidRunnerGame = () => {
    const [position, setPosition] = useState(0);
    const [isJumping, setIsJumping] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !isJumping) {
                setIsJumping(true);
                setTimeout(() => setIsJumping(false), 1000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isJumping]);

    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: '200px', backgroundColor: '#f0f0f0' }}>
            <div style={{
                position: 'absolute',
                bottom: isJumping ? '100px' : '0',
                left: `${position}px`,
                width: '50px',
                height: '50px',
                backgroundColor: 'gold',
                transition: 'bottom 0.5s ease' }}>
            </div>
        </div>
    );
};

export default AchaemenidRunnerGame;