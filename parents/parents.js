// 添加到文件开头
// 登录状态检查函数
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        // 如果没有登录信息，重定向到登录页面
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

// 正确的调用方式 - 不需要return
checkLoginStatus();
// 初始化图表
function initCharts() {
    // 课程完成趋势图
    const courseCtx = document.getElementById('courseTrendChart');
    new Chart(courseCtx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '完成课程数',
                data: [2, 1, 1, 2, 0, 1, 1],
                borderColor: '#9333ea',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // 知识点掌握雷达图
    const knowledgeCtx = document.getElementById('knowledgeRadarChart');
    new Chart(knowledgeCtx, {
        type: 'radar',
        data: {
            labels: ['基础编程', '逻辑思维', '问题分析', '创意设计', '团队协作'],
            datasets: [{
                label: '掌握程度',
                data: [90, 75, 70, 85, 80],
                borderColor: '#9333ea',
                backgroundColor: 'rgba(147, 51, 234, 0.2)'
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

// 标签页切换
function initTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // 更新标签样式
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-purple-600', 'text-white');
                t.classList.add('text-gray-600', 'hover:bg-purple-50');
            });
            
            tab.classList.add('active', 'bg-purple-600', 'text-white');
            tab.classList.remove('text-gray-600', 'hover:bg-purple-50');
            
            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.remove('hidden');
            document.getElementById(tabId).classList.add('active');
            
            // 如果切换到学习动态标签，初始化图表
            if (tabId === 'learning') {
                // 延迟初始化，确保DOM已更新
                setTimeout(() => {
                    // 检查图表是否已初始化
                    const courseChart = Chart.getChart('courseTrendChart');
                    const knowledgeChart = Chart.getChart('knowledgeRadarChart');
                    
                    if (!courseChart && !knowledgeChart) {
                        initCharts();
                    }
                }, 100);
            }
        });
    });
}

// 设备使用限制切换
function initUseLimitToggle() {
    const toggle = document.getElementById('useLimitToggle');
    const settings = document.getElementById('useLimitSettings');
    
    if (toggle && settings) {
        // 初始化状态
        settings.style.display = toggle.checked ? 'block' : 'none';
        
        toggle.addEventListener('change', () => {
            settings.style.display = toggle.checked ? 'block' : 'none';
        });
    }
}

// 初始化退出登录功能
function initLogout() {
    const logoutButton = document.querySelector('a:has(.fa-sign-out)');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // 跳转到主页
            window.location.href = '../index.html';
        });
    }
}

// 初始化用户菜单功能
function initUserMenu() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    if (userMenuButton && userMenuDropdown) {
        // 点击按钮切换菜单显示状态
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，避免点击按钮时关闭菜单
            userMenuDropdown.classList.toggle('hidden');
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });
        
        // 阻止点击菜单项时关闭菜单
        userMenuDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// 根据孩子姓名动态更新家长信息
function updateParentInfo() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    let childName = urlParams.get('childName') || '小明'; // 默认值为小明
    
    // 生成家长称呼（如：王家长）
    const parentName = childName.charAt(0) + '家长';
    
    // 更新用户菜单中的家长称呼
    const userNameElement = document.querySelector('#userMenuButton span');
    if (userNameElement) {
        userNameElement.textContent = parentName;
    }
    
    // 更新欢迎信息
    const welcomeElement = document.querySelector('#learning .mb-8 h2');
    const overviewElement = document.querySelector('#learning .mb-8 p');
    
    if (welcomeElement) {
        welcomeElement.textContent = `欢迎回来，${parentName}`;
    }
    
    if (overviewElement) {
        overviewElement.textContent = `这是${childName}本周的学习情况概览`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initUseLimitToggle();
    initLogout(); // 初始化退出登录功能
    initUserMenu(); // 初始化用户菜单功能
    updateParentInfo(); // 根据孩子姓名动态更新家长信息
    
    // 初始化默认显示的图表
    initCharts();
});

// 加载教师消息
function loadTeacherMessages() {
    const messagesContainer = document.querySelector('#communication .space-y-4');
    if (!messagesContainer) return;
    
    // 获取当前登录孩子的姓名
    let childName = '小明'; // 默认值
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('childName')) {
        childName = urlParams.get('childName');
    }
    
    // 从localStorage获取消息
    const messages = JSON.parse(localStorage.getItem('parentMessages') || '[]');
    
    // 过滤出当前孩子的消息
    const childMessages = messages.filter(msg => msg.studentName === childName);
    
    // 如果没有消息，保持原有示例消息不变
    if (childMessages.length === 0) {
        return; // 保留原有的示例消息
    }
    
    // 按时间倒序排序
    childMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let html = '';
    childMessages.forEach(msg => {
        const date = new Date(msg.timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        // 格式化时间显示
        let timeDisplay;
        if (diffMins < 1) {
            timeDisplay = '刚刚';
        } else if (diffMins < 60) {
            timeDisplay = `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            timeDisplay = `${diffHours}小时前`;
        } else if (diffDays < 7) {
            timeDisplay = `${diffDays}天前`;
        } else {
            timeDisplay = `${date.getMonth() + 1}月${date.getDate()}日`;
        }
        
        // 消息标签颜色
        let tagClass = 'bg-purple-100 text-purple-700';
        let tagText = msg.type;
        
        if (msg.type.includes('通知')) {
            tagClass = 'bg-blue-100 text-blue-700';
        } else if (msg.type.includes('提醒')) {
            tagClass = 'bg-yellow-100 text-yellow-700';
        }
        
        html += `
            <div class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <i class="fa fa-user-circle"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-800">${msg.teacherName}</p>
                            <p class="text-xs text-gray-500">编程教师</p>
                        </div>
                    </div>
                    <span class="text-xs text-gray-500">${timeDisplay}</span>
                </div>
                <p class="text-gray-600 text-sm line-clamp-2">${msg.content}</p>
                <div class="mt-2 flex justify-between items-center">
                    <span class="inline-block px-2 py-1 text-xs ${tagClass} rounded">${tagText}</span>
                    ${!msg.isRead ? '<span class="w-2 h-2 bg-red-500 rounded-full"></span>' : ''}
                </div>
            </div>
        `;
    });
    
    // 添加查看全部按钮
    html += `
        <div class="mt-4 text-center">
            <button class="px-4 py-2 text-sm text-purple-600 hover:text-purple-800 transition-colors">
                查看全部消息 <i class="fa fa-angle-right ml-1"></i>
            </button>
        </div>
    `;
    
    messagesContainer.innerHTML = html;
    
    // 标记消息为已读
    markMessagesAsRead(childName);
}

// 标记消息为已读
function markMessagesAsRead(childName) {
    let messages = JSON.parse(localStorage.getItem('parentMessages') || '[]');
    
    messages = messages.map(msg => {
        if (msg.studentName === childName && !msg.isRead) {
            return { ...msg, isRead: true };
        }
        return msg;
    });
    
    localStorage.setItem('parentMessages', JSON.stringify(messages));
}

// 确保initUserMenu函数正确实现
function initUserMenu() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    console.log('初始化用户菜单:', { userMenuButton, userMenuDropdown }); // 添加调试日志
    
    if (userMenuButton && userMenuDropdown) {
        // 先移除可能存在的旧事件监听器，避免重复绑定
        const newUserMenuButton = userMenuButton.cloneNode(true);
        userMenuButton.parentNode.replaceChild(newUserMenuButton, userMenuButton);
        
        // 重新获取元素引用
        const updatedUserMenuButton = document.getElementById('userMenuButton');
        
        // 绑定新的点击事件
        updatedUserMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('菜单按钮被点击'); // 调试日志
            userMenuDropdown.classList.toggle('hidden');
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!updatedUserMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.add('hidden');
            }
        });
        
        // 阻止点击菜单项时关闭菜单
        userMenuDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    } else {
        console.error('无法找到用户菜单元素');
    }
}

// 当切换到沟通选项卡时重新加载消息
document.querySelectorAll('.nav-tab').forEach(button => { // 使用正确的选择器.nav-tab
    button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        if (tabId === 'communication') {
            setTimeout(loadTeacherMessages, 100);
        }
    });
});