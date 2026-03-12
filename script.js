// ========== 液体背景跟随鼠标（实时版本）==========
const blobs = document.querySelectorAll('.liquid-blob');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;

// 实时跟踪鼠标位置
document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// 平滑动画循环
function animateBlobs() {
    // 让当前位置平滑移向目标位置
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    blobs.forEach((blob, index) => {
        // 每个blob有不同的动画延迟
        const delay = index * 0.3;
        const time = Date.now() / 1000 + delay;
        
        // 多层次的随机波动，增加流动感
        const waveX = Math.sin(time * 0.8) * 80 + Math.cos(time * 0.5) * 50;
        const waveY = Math.cos(time * 0.6) * 80 + Math.sin(time * 0.7) * 50;
        
        // 跟随鼠标但有视差效果
        const parallaxX = (mouseX - window.innerWidth / 2) * (0.1 + index * 0.05);
        const parallaxY = (mouseY - window.innerHeight / 2) * (0.1 + index * 0.05);
        
        // 最终位置 = 波浪 + 视差 + 初始位置
        const finalX = parallaxX + waveX;
        const finalY = parallaxY + waveY;

        blob.style.transform = `translate(${finalX}px, ${finalY}px)`;
    });

    requestAnimationFrame(animateBlobs);
}

animateBlobs();

// ========== 页面加载动画 ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    // 添加进入动画
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        setTimeout(() => {
            section.style.transition = 'all 0.8s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ========== 导航栏高亮 ==========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ========== 滚动导航更新 ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });

    // 滚动时的视差效果
    const blobs = document.querySelectorAll('.liquid-blob');
    blobs.forEach((blob, index) => {
        blob.style.filter = `blur(${80 + pageYOffset * 0.02}px)`;
    });
});

// ========== 表单提交 ==========
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 顯示成功彈窗
    showSuccessPopup('感謝你的訊息！我會盡快回覆你。');
    this.reset();
});

// ========== 成功彈窗函數 ==========
function showSuccessPopup(message) {
    // 創建彈窗容器
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✓</div>
            <h3>成功！</h3>
            <p>${message}</p>
            <button class="popup-btn">關閉</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // 觸發動畫
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // 關閉按鈕
    popup.querySelector('.popup-btn').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300);
    });
    
    // 3秒後自動關閉
    setTimeout(() => {
        if (popup.parentNode) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 3000);
}

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== 元素进入视口时的动画 ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item, .project-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ========== 鼠标跟随光晕效果 ==========
const createGlowEffect = () => {
    const glowSize = 300;
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.width = glowSize + 'px';
    glow.style.height = glowSize + 'px';
    // 改為金黃色/橙黃色的顯眼漸變
    glow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.15), transparent)';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '5';
    glow.style.filter = 'blur(50px)';
    glow.style.transition = 'all 0.3s ease-out';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = (e.clientX - glowSize / 2) + 'px';
        glow.style.top = (e.clientY - glowSize / 2) + 'px';
    });
};

createGlowEffect();