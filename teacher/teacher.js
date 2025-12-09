// 添加到文件开头
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        // 如果没有登录信息，重定向到登录页面
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

// 移除全局return语句，避免阻止后续代码执行
checkLoginStatus();

// 侧边栏下拉菜单功能
function initSidebarDropdowns() {
    const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const dropdown = toggle.nextElementSibling;
            const icon = toggle.querySelector('.sidebar-dropdown-icon');
            
            // 切换下拉菜单显示状态
            dropdown.classList.toggle('hidden');
            
            // 旋转箭头图标
            if (dropdown.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// 移动端菜单功能
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });
    }
}

// 页面导航切换功能
// 假设现有的页面导航函数类似这样，确保它能正确处理reviews页面
function initPageNavigation() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标页面ID
            const targetId = this.getAttribute('href').substring(1);
            
            // 隐藏所有section
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('hidden');
            });
            
            // 显示目标section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                
                // 更新标题
                const headerTitle = document.querySelector('header h2');
                if (headerTitle) {
                    headerTitle.textContent = targetSection.querySelector('h3')?.textContent || targetId;
                }
            }
            
            // 处理移动端菜单关闭
            if (window.innerWidth < 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.add('-translate-x-full');
                }
            }
        });
    });
}

// 初始化图表
function initCharts() {
    // 学习进度图表
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '完成率 (%)',
                    data: [65, 72, 78, 70, 85, 80, 88],
                    borderColor: '#6d28d9',
                    backgroundColor: 'rgba(109, 40, 217, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // 知识点掌握情况图表
    const knowledgeCtx = document.getElementById('knowledgeChart');
    if (knowledgeCtx) {
        new Chart(knowledgeCtx, {
            type: 'radar',
            data: {
                labels: ['基础编程', '循环结构', '条件判断', '函数定义', '传感器使用', '机器人控制'],
                datasets: [{
                    label: '班级平均',
                    data: [85, 78, 82, 75, 70, 68],
                    borderColor: '#6d28d9',
                    backgroundColor: 'rgba(109, 40, 217, 0.2)',
                }, {
                    label: '优秀学生',
                    data: [95, 92, 90, 88, 85, 82],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

// 初始化用户菜单模态框
function initUserMenuModal() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuModal = document.getElementById('user-menu-modal');
    const closeUserMenu = document.getElementById('close-user-menu');
    const logoutBtn = document.getElementById('logout-btn');
    
    // 显示用户菜单
    if (userMenuButton && userMenuModal) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuModal.classList.remove('hidden');
        });
    }
    
    // 关闭用户菜单
    function hideUserMenu() {
        if (userMenuModal) {
            userMenuModal.classList.add('hidden');
        }
    }
    
    if (closeUserMenu) {
        closeUserMenu.addEventListener('click', hideUserMenu);
    }
    
    // 点击模态框外部关闭
    if (userMenuModal) {
        userMenuModal.addEventListener('click', (e) => {
            if (e.target === userMenuModal) {
                hideUserMenu();
            }
        });
    }
    
    // 退出登录功能
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 跳转到登录页面
            window.location.href = '../index.html';
        });
    }
}

// 根据教师姓名动态更新教师信息
function updateTeacherInfo() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    let teacherName = urlParams.get('teacherName') || '李'; // 默认姓为李
    
    // 提取姓（如果姓名是两个字，则取第一个字作为姓；如果是复姓或多字名，则需要更复杂的逻辑）
    // 这里简化处理，只取第一个字作为姓
    const lastName = teacherName.charAt(0);
    const fullTeacherName = lastName + '老师';
    
    // 更新用户菜单中的教师姓名
    const userNameElement = document.querySelector('#user-menu-button span');
    if (userNameElement) {
        userNameElement.textContent = fullTeacherName;
    }
}

// 页面加载完成后初始化所有功能
// 初始化作品点评功能
function initReviews() {
    // 初始化评分星星
    initRatingStars();
    
    // 绑定发送点评按钮事件
    const sendReviewBtn = document.getElementById('send-review-btn');
    if (sendReviewBtn) {
        sendReviewBtn.addEventListener('click', sendReview);
    }
    
    // 加载历史点评记录
    loadReviewHistory();
}

// 初始化评分星星功能
function initRatingStars() {
    const stars = document.querySelectorAll('#rating-stars i');
    const ratingValue = document.getElementById('rating-value');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingValue.value = rating;
            
            // 更新星星显示
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.className = 'fa fa-star text-yellow-400 cursor-pointer text-xl hover:text-yellow-500';
                } else {
                    s.className = 'fa fa-star text-gray-300 cursor-pointer text-xl hover:text-yellow-400';
                }
            });
        });
    });
}

// 发送点评
function sendReview() {
    const studentName = document.getElementById('student-select').value;
    const workName = document.getElementById('work-name').value;
    const reviewContent = document.getElementById('review-content').value;
    const rating = document.getElementById('rating-value').value;
    
    // 验证表单
    if (!studentName || !workName || !reviewContent || rating == 0) {
        alert('请填写完整点评信息并进行评分');
        return;
    }
    
    // 获取教师姓名（从页面或本地存储中获取）
    let teacherName = '李老师'; // 默认值
    const teacherNameElement = document.querySelector('#user-menu-button span');
    if (teacherNameElement) {
        teacherName = teacherNameElement.textContent.trim();
    }
    
    // 创建点评对象
    const review = {
        id: Date.now(), // 使用时间戳作为唯一ID
        studentName: studentName,
        workName: workName,
        content: reviewContent,
        rating: rating,
        teacherName: teacherName,
        timestamp: new Date().toISOString(),
        type: '作品点评'
    };
    
    // 保存到localStorage
    saveReviewToStorage(review);
    
    // 发送到家长端（通过localStorage共享）
    sendToParent(review);
    
    // 重置表单
    document.getElementById('student-select').value = '';
    document.getElementById('work-name').value = '';
    document.getElementById('review-content').value = '';
    document.getElementById('rating-value').value = '0';
    
    // 重置星星显示
    const stars = document.querySelectorAll('#rating-stars i');
    stars.forEach(s => {
        s.className = 'fa fa-star text-gray-300 cursor-pointer text-xl hover:text-yellow-400';
    });
    
    // 重新加载历史记录
    loadReviewHistory();
    
    alert('点评发送成功！');
}

// 保存点评到本地存储
function saveReviewToStorage(review) {
    let reviews = JSON.parse(localStorage.getItem('teacherReviews') || '[]');
    reviews.push(review);
    localStorage.setItem('teacherReviews', JSON.stringify(reviews));
}

// 发送点评到家长端
function sendToParent(review) {
    // 获取现有消息
    let parentMessages = JSON.parse(localStorage.getItem('parentMessages') || '[]');
    
    // 创建家长端消息对象
    const parentMessage = {
        id: review.id,
        teacherName: review.teacherName,
        content: `作品《${review.workName}》点评：${review.content}\n评分：${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`,
        timestamp: review.timestamp,
        type: review.type,
        studentName: review.studentName,
        isRead: false
    };
    
    parentMessages.push(parentMessage);
    localStorage.setItem('parentMessages', JSON.stringify(parentMessages));
}

// 加载历史点评记录
function loadReviewHistory() {
    const reviewHistory = document.getElementById('review-history');
    if (!reviewHistory) return;
    
    const reviews = JSON.parse(localStorage.getItem('teacherReviews') || '[]');
    
    if (reviews.length === 0) {
        reviewHistory.innerHTML = '<div class="text-gray-500 text-center py-8">暂无点评记录</div>';
        return;
    }
    
    // 按时间倒序排序
    reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let html = '';
    reviews.forEach(review => {
        const date = new Date(review.timestamp);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        html += `
            <div class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-medium text-gray-900">${review.studentName} - ${review.workName}</h4>
                        <div class="flex items-center mt-1">
                            <div class="text-yellow-400 mr-2">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                            <span class="text-xs text-gray-500">${formattedDate}</span>
                        </div>
                    </div>
                    <span class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">${review.type}</span>
                </div>
                <p class="text-gray-600 text-sm mt-2">${review.content}</p>
            </div>
        `;
    });
    
    reviewHistory.innerHTML = html;
}

// 在DOMContentLoaded事件中添加initReviews调用
document.addEventListener('DOMContentLoaded', () => {
    // 原有的初始化函数
    initSidebarDropdowns();
    initMobileMenu();
    initPageNavigation();
    initCharts();
    initUserMenuModal();
    
    // 添加作品点评初始化
    initReviews();
});

updateTeacherInfo(); // 根据教师姓名动态更新教师信息