// Add strict mode to prevent common JavaScript errors
'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // Add rotation functionality to sun emoji
    const rotatingSun = document.getElementById('rotatingSun');
    if (rotatingSun) {
        rotatingSun.addEventListener('click', function() {
            // Remove animation class if it exists to reset animation
            this.classList.remove('rotate-sun');
            
            // Trigger reflow to restart animation
            void this.offsetWidth;
            
            // Add animation class back
            this.classList.add('rotate-sun');
        });
    }
    
    // Initialize Chart.js for staking rewards with default 1000 WMTX
    const stakingChart = initRewardsChart();
    
    // Handle staking amount input and recalculation
    const stakingInput = document.getElementById('staking-amount');
    const calculateBtn = document.getElementById('calculate-btn');
    
    if (calculateBtn && stakingInput) {
        // Sanitize inputs to prevent XSS
        stakingInput.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        
        calculateBtn.addEventListener('click', function() {
            updateChart(stakingChart, parseInt(stakingInput.value, 10) || 1000);
        });
        
        // Allow Enter key to trigger calculation
        stakingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                updateChart(stakingChart, parseInt(stakingInput.value, 10) || 1000);
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to document
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside of it
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            // Check if click is outside the navigation
            if (mainNav && !mainNav.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Close menu when a link is clicked
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Toggle FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Initialize Plinko game
    initPlinkoGame();
});

function updateChart(chart, initialInvestment) {
    // Ensure a minimum value
    initialInvestment = Math.max(1, initialInvestment);
    
    // Staking rewards data (yearly percentages)
    const annualRewardRate = 10; // 10% annual return
    
    // Calculate returns for 1, 2, 5, and 10 years
    const oneYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 1);
    const twoYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 2);
    const fiveYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 5);
    const tenYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 10);
    
    // Update chart data
    chart.data.datasets[0].data = [
        initialInvestment, 
        oneYearReturn, 
        twoYearReturn, 
        fiveYearReturn, 
        tenYearReturn
    ];
    
    // Update chart label
    chart.data.datasets[0].label = `WMTX Staking Rewards (Starting with ${initialInvestment.toLocaleString()} WMTX)`;
    
    // Update tooltip calculation base
    chart.options.plugins.tooltip.callbacks.label = function(context) {
        const value = context.raw;
        const profit = value - initialInvestment;
        return [
            `Total: ${value.toFixed(0)} WMTX`,
            `Profit: ${profit.toFixed(0)} WMTX`,
            `Growth: ${((profit / initialInvestment) * 100).toFixed(1)}%`
        ];
    };
    
    // Refresh the chart
    chart.update();
    
    // Add a small animation effect to the chart container
    const chartContainer = document.querySelector('.rewards-chart-container');
    if (chartContainer) {
        chartContainer.classList.add('updated');
        setTimeout(() => {
            chartContainer.classList.remove('updated');
        }, 1000);
    }
}

function calculateCompoundedReturn(initialInvestment, ratePercentage, years) {
    const annualRate = ratePercentage / 100;
    return initialInvestment * Math.pow(1 + annualRate, years);
}

function initRewardsChart() {
    const canvas = document.getElementById('rewardsChart');
    if (!canvas) return null;
    
    // Pixelated styling for Chart.js
    Chart.defaults.font.family = "'Comic Neue', sans-serif";
    Chart.defaults.font.size = 14;
    
    // Initial investment of 1000 WMTX
    const initialInvestment = 1000;
    
    // Annual reward rate set to 10%
    const annualRewardRate = 10;
    
    // Calculate returns for 1, 2, 5, and 10 years
    const oneYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 1);
    const twoYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 2);
    const fiveYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 5);
    const tenYearReturn = calculateCompoundedReturn(initialInvestment, annualRewardRate, 10);
    
    // Create the chart
    const rewardsChart = new Chart(canvas, {
        type: 'bar', // Pixel-style bar chart
        data: {
            labels: ['Initial', '1 Year', '2 Years', '5 Years', '10 Years'],
            datasets: [{
                label: `WMTX Staking Rewards (Starting with ${initialInvestment.toLocaleString()} WMTX)`,
                data: [initialInvestment, oneYearReturn, twoYearReturn, fiveYearReturn, tenYearReturn],
                backgroundColor: [
                    'rgba(255, 255, 0, 0.7)', // Yellow
                    'rgba(255, 51, 0, 0.7)',  // Red
                    'rgba(255, 51, 0, 0.7)',  // Red
                    'rgba(51, 204, 0, 0.7)',  // Green
                    'rgba(51, 204, 0, 0.7)'   // Green
                ],
                borderColor: [
                    '#333333', // Dark border
                    '#333333',
                    '#333333',
                    '#333333',
                    '#333333'
                ],
                borderWidth: 2,
                borderSkipped: false, // For pixel-like appearance
                borderRadius: 0, // Sharp corners for pixel style
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5],
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + ' WMTX';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const profit = value - initialInvestment;
                            return [
                                `Total: ${value.toFixed(0)} WMTX`,
                                `Profit: ${profit.toFixed(0)} WMTX`,
                                `Growth: ${((profit / initialInvestment) * 100).toFixed(1)}%`
                            ];
                        }
                    },
                    backgroundColor: '#333333',
                    titleFont: {
                        family: "'Patrick Hand', cursive",
                        size: 16
                    },
                    bodyFont: {
                        family: "'Comic Neue', cursive",
                        size: 14
                    },
                    padding: 12,
                    cornerRadius: 0,
                    displayColors: false
                },
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutBounce'
            }
        }
    });
    
    // Add pixel-art effect to the canvas
    canvas.style.imageRendering = 'pixelated';
    
    return rewardsChart;
}

// Plinko Game Animation
function initPlinkoGame() {
    const dataBall = document.querySelector('.data-ball');
    const dataSize = document.querySelector('.data-size');
    const pegs = document.querySelectorAll('.plinko-peg');
    const buckets = document.querySelectorAll('.plinko-bucket');
    const board = document.querySelector('.plinko-board');

    // Abort initialization if the game elements are missing (e.g. on
    // policy pages that still include this script)
    if (!dataBall || !dataSize || !pegs.length || !buckets.length || !board) {
        return;
    }
    
    // Game state variables
    let isAnimating = false;
    let ballPosition = { x: 0, y: 10 };
    let velocity = { x: 0, y: 0 };
    let ballInBucket = false;
    let currentBucket = null;
    
    // Track bucket colors: false = white, true = yellow
    const bucketIsYellow = Array(buckets.length).fill(false);
    
    // Random data sizes in KB or MB
    const getRandomDataSize = () => {
        const size = Math.floor(Math.random() * 1000);
        return size > 500 ? `${(size/1000).toFixed(1)}MB` : `${size}KB`;
    };
    
    // Start a new ball drop
    function startNewBall() {
        // Reset state
        ballInBucket = false;
        currentBucket = null;
        isAnimating = true;
        
        // Random starting position
        const startOffset = (Math.random() * 30) - 15;
        ballPosition = { x: startOffset, y: 10 };
        
        // Random initial velocity
        velocity = { 
            x: (Math.random() * 6) - 3, 
            y: 2 
        };
        
        // Generate random data size
        dataSize.textContent = getRandomDataSize();
        
        // Position ball
        dataBall.style.transform = `translateX(${ballPosition.x}px)`;
        dataBall.style.top = `${ballPosition.y}px`;
        
        // Make ball visible
        dataBall.style.opacity = '1';
        
        // Start animation
        requestAnimationFrame(animateBall);
    }
    
    // Animate the ball
    function animateBall() {
        if (!isAnimating) return;
        
        // Update position
        ballPosition.x += velocity.x;
        ballPosition.y += velocity.y;
        
        // Accelerate downward (gravity)
        velocity.y += 0.2;
        
        // If ball is in a bucket, handle collision with bucket walls
        if (ballInBucket && currentBucket) {
            handleBucketCollisions();
        } else {
            // Bounds checking - left/right walls of game
            const maxX = 100;
            if (ballPosition.x < -maxX) {
                ballPosition.x = -maxX;
                velocity.x *= -0.8; // Bounce with damping
            } else if (ballPosition.x > maxX) {
                ballPosition.x = maxX;
                velocity.x *= -0.8; // Bounce with damping
            }
            
            // Check for peg collisions
            checkPegCollisions();
            
            // Check if ball reached the bottom
            if (ballPosition.y > 240 && !ballInBucket) {
                landInBucket();
            }
        }
        
        // Apply position
        dataBall.style.transform = `translateX(${ballPosition.x}px)`;
        dataBall.style.top = `${ballPosition.y}px`;
        
        // Continue animation if ball is on screen
        if (ballPosition.y < 300) {
            requestAnimationFrame(animateBall);
        } else {
            // Ball went off screen, start a new one after delay
            setTimeout(startNewBall, 1000);
        }
    }
    
    // Handle collisions with bucket walls
    function handleBucketCollisions() {
        const bucketRect = currentBucket.getBoundingClientRect();
        const ballRect = dataBall.getBoundingClientRect();
        const ballRadius = ballRect.width / 2;
        
        // Calculate bucket boundaries
        const bucketLeft = bucketRect.left;
        const bucketRight = bucketRect.right;
        const bucketBottom = bucketRect.bottom - 10; // Subtract a bit for bottom padding
        
        // Get ball position relative to viewport
        const ballAbsoluteX = ballRect.left + ballRadius;
        const ballAbsoluteY = ballRect.top + ballRadius;
        
        // Calculate relative position to bucket
        const ballRelativeX = ballAbsoluteX - bucketLeft;
        
        // Check for collision with left wall
        if (ballAbsoluteX - ballRadius < bucketLeft) {
            velocity.x = Math.abs(velocity.x) * 0.8; // Bounce right
            // Play with the ball position to prevent sticking
            ballPosition.x += 2;
        }
        // Check for collision with right wall
        else if (ballAbsoluteX + ballRadius > bucketRight) {
            velocity.x = -Math.abs(velocity.x) * 0.8; // Bounce left
            // Play with the ball position to prevent sticking
            ballPosition.x -= 2;
        }
        
        // Check for collision with bottom
        if (ballAbsoluteY + ballRadius > bucketBottom) {
            velocity.y = -Math.abs(velocity.y) * 0.5; // Bounce up with more damping
            // Add some random horizontal movement on bottom bounce
            velocity.x += (Math.random() - 0.5) * 0.5;
            
            // Gradually slow down
            velocity.x *= 0.95;
            
            // If almost stopped, prepare for new ball
            if (Math.abs(velocity.y) < 0.5 && Math.abs(velocity.x) < 0.5) {
                // Ball has settled in the bucket
                isAnimating = false;
                
                // Find bucket index
                const bucketIndex = Array.from(buckets).indexOf(currentBucket);
                
                // Determine if bucket is currently yellow by checking its background color
                const computedStyle = window.getComputedStyle(currentBucket);
                const currentColor = computedStyle.backgroundColor;
                const isCurrentlyYellow = currentColor !== 'rgb(255, 255, 255)' && 
                                          currentColor.indexOf('255, 255, 0') > -1;
                
                // Temporary glow effect regardless of final color
                currentBucket.classList.add('bucket-glow');
                
                setTimeout(() => {
                    // Remove glow effect
                    currentBucket.classList.remove('bucket-glow');
                    
                    // Always toggle between white and yellow
                    if (isCurrentlyYellow) {
                        // If yellow, change to white
                        currentBucket.style.backgroundColor = 'white';
                    } else {
                        // If white, change to yellow
                        currentBucket.style.backgroundColor = '#ffff00';
                    }
                    
                    // Fade out the ball
                    dataBall.style.opacity = '0.2';
                    // Start a new ball after delay
                    setTimeout(startNewBall, 1000);
                }, 1000); // 1 second glow
            }
        }
    }
    
    // Check for collisions with pegs
    function checkPegCollisions() {
        pegs.forEach(peg => {
            const pegRect = peg.getBoundingClientRect();
            const ballRect = dataBall.getBoundingClientRect();
            
            // Calculate centers
            const pegCenter = {
                x: pegRect.left + pegRect.width / 2,
                y: pegRect.top + pegRect.height / 2
            };
            
            const ballCenter = {
                x: ballRect.left + ballRect.width / 2,
                y: ballRect.top + ballRect.height / 2
            };
            
            // Calculate distance between centers
            const dx = pegCenter.x - ballCenter.x;
            const dy = pegCenter.y - ballCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Collision detection with radius
            const minDistance = (pegRect.width / 2) + (ballRect.width / 2);
            
            if (distance < minDistance) {
                // Collision detected!
                
                // Highlight the peg
                peg.classList.add('highlight');
                setTimeout(() => peg.classList.remove('highlight'), 200);
                
                // Bounce effect
                const angle = Math.atan2(dy, dx);
                const bounceForce = 2 + Math.random() * 2;
                
                // Apply bounce force in the direction away from the peg
                velocity.x = -Math.cos(angle) * bounceForce;
                velocity.y = -Math.sin(angle) * bounceForce + 1;
                
                // Add some randomness to bounces
                velocity.x += (Math.random() - 0.5) * 2;
            }
        });
    }
    
    // Land in a bucket
    function landInBucket() {
        // Determine which bucket (based on x position)
        const bucketWidth = 250 / buckets.length;
        let bucketIndex = Math.floor((ballPosition.x + 125) / bucketWidth);
        
        // Clamp bucket index to valid range
        bucketIndex = Math.max(0, Math.min(buckets.length - 1, bucketIndex));
        
        // Set current bucket and mark that we're in a bucket
        currentBucket = buckets[bucketIndex];
        ballInBucket = true;
        
        // Add glow effect to highlight the active bucket
        currentBucket.classList.add('active-bucket');
        
        // Adjust initial velocity when entering bucket
        velocity.y *= 0.6; // Reduce vertical velocity
        // Add a bit of horizontal velocity toward center of bucket
        const bucketRect = currentBucket.getBoundingClientRect();
        const bucketCenterX = bucketRect.left + bucketRect.width / 2;
        const ballRect = dataBall.getBoundingClientRect();
        const ballCenterX = ballRect.left + ballRect.width / 2;
        const pullToCenter = (bucketCenterX - ballCenterX) * 0.03;
        velocity.x += pullToCenter;
    }
    
    // Start the first ball
    setTimeout(startNewBall, 500);
} 