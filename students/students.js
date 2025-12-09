/**
 * AI XBot 机器人教育平台通用功能模块
 */
// 修改后的正确代码
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

// 用户身份枚举
const USER_ROLE = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    PARENT: 'parent'
};

// 全局变量，用于跟踪是否是首次访问
let isFirstAccess = true;

/**
 * 学生登录验证函数
 * @param {Object} studentInfo - 学生信息对象
 * @param {string} studentInfo.school - 学校名称
 * @param {string} studentInfo.name - 学生姓名
 * @param {string} studentInfo.studentId - 学号
 * @param {string} studentInfo.password - 密码
 * @returns {Promise<Object>} - 登录结果
 */
async function validateStudentLogin(studentInfo) {
    // 表单验证
    if (!studentInfo.school || !studentInfo.name || !studentInfo.studentId || !studentInfo.password) {
        return {
            success: false,
            message: '请填写完整的学生信息'
        };
    }
    
    try {
        // 这里应该是实际的API调用，现在使用模拟数据
        // const response = await fetch('/api/student/login', { ... });
        // const result = await response.json();
        
        // 模拟登录验证
        if (studentInfo.studentId && studentInfo.password) {
            return {
                success: true,
                message: '登录成功',
                userInfo: {
                    role: USER_ROLE.STUDENT,
                    name: studentInfo.name,
                    school: studentInfo.school,
                    studentId: studentInfo.studentId,
                    // 其他用户信息
                }
            };
        } else {
            return {
                success: false,
                message: '学号或密码错误'
            };
        }
    } catch (error) {
        console.error('学生登录验证错误:', error);
        return {
            success: false,
            message: '登录失败，请稍后重试'
        };
    }
}

/**
 * 教师/家长登录验证函数
 * @param {Object} userInfo - 用户信息对象
 * @param {string} userInfo.username - 用户名
 * @param {string} userInfo.password - 密码
 * @param {string} userInfo.role - 角色：teacher或parent
 * @returns {Promise<Object>} - 登录结果
 */
async function validateTeacherParentLogin(userInfo) {
    // 表单验证
    if (!userInfo.username || !userInfo.password) {
        return {
            success: false,
            message: '请填写完整的登录信息'
        };
    }
    
    try {
        // 这里应该是实际的API调用，现在使用模拟数据
        // const response = await fetch('/api/teacher/login', { ... });
        // const result = await response.json();
        
        // 模拟登录验证
        if (userInfo.username && userInfo.password) {
            return {
                success: true,
                message: '登录成功',
                userInfo: {
                    role: userInfo.role || USER_ROLE.TEACHER,
                    username: userInfo.username,
                    displayName: userInfo.username,
                    // 其他用户信息
                }
            };
        } else {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }
    } catch (error) {
        console.error('教师/家长登录验证错误:', error);
        return {
            success: false,
            message: '登录失败，请稍后重试'
        };
    }
}

/**
 * 保存用户登录状态
 * @param {Object} userInfo - 用户信息
 */
function saveUserLoginState(userInfo) {
    try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        // 标记为已登录状态
        localStorage.setItem('isLoggedIn', 'true');
        console.log('用户登录状态已保存');
    } catch (error) {
        console.error('保存用户登录状态失败:', error);
    }
}

/**
 * 获取用户登录状态
 * @returns {Object|null} - 用户信息或null
 */
function getUserLoginState() {
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('获取用户登录状态失败:', error);
        return null;
    }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} - 是否已登录
 */
function isUserLoggedIn() {
    try {
        return localStorage.getItem('isLoggedIn') === 'true';
    } catch (error) {
        console.error('检查登录状态失败:', error);
        return false;
    }
}

/**
 * 清除用户登录状态
 */
function clearUserLoginState() {
    try {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
        console.log('用户登录状态已清除');
    } catch (error) {
        console.error('清除用户登录状态失败:', error);
    }
}

/**
 * 初始化导航下拉菜单和用户相关功能
 */
function initUserNavigation() {
    // 添加调试日志，确认函数是否被调用
    console.log('初始化用户菜单导航');
    
    // 获取DOM元素
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenuModal = document.getElementById('user-menu-modal');
    const closeUserMenuBtn = document.getElementById('close-user-menu-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // 检查元素是否存在
    console.log('用户菜单按钮存在:', !!userMenuBtn);
    console.log('用户菜单模态框存在:', !!userMenuModal);
    console.log('关闭按钮存在:', !!closeUserMenuBtn);
    console.log('退出按钮存在:', !!logoutBtn);
    
    // 防止重复绑定事件，先移除旧的监听器
    if (userMenuBtn) {
        // 使用更简单的点击事件处理
        userMenuBtn.onclick = function() {
            console.log('用户菜单按钮被点击');
            if (userMenuModal) {
                // 切换显示/隐藏状态
                userMenuModal.classList.toggle('hidden');
                // 确保z-index足够高
                userMenuModal.style.zIndex = '1000';
            }
        };
    }
    
    // 关闭用户菜单
    if (closeUserMenuBtn && userMenuModal) {
        closeUserMenuBtn.onclick = function() {
            userMenuModal.classList.add('hidden');
        };
    }
    
    // 退出登录 - 修改为跳转到index.html
    if (logoutBtn && userMenuModal) {
        logoutBtn.onclick = function() {
            // 清除登录状态
            clearUserLoginState();
            userMenuModal.classList.add('hidden');
            // 跳转到首页
            window.location.href = '../index.html';
        };
    }
    
    // 简化点击模态框外部关闭模态框的逻辑
    document.addEventListener('click', function(e) {
        if (userMenuModal && !userMenuModal.classList.contains('hidden')) {
            // 检查点击是否在模态框内容外
            const modalContent = userMenuModal.querySelector('.modal-content');
            if (!userMenuBtn.contains(e.target) && (!modalContent || !modalContent.contains(e.target))) {
                userMenuModal.classList.add('hidden');
            }
        }
    });
}

/**
 * 检查用户登录状态并更新UI
 */
function checkUserLoginStatus() {
    const userInfo = getUserLoginState();
    const userNameElement = document.getElementById('user-name');
    
    if (userInfo && userNameElement) {
        // 更新显示的用户名
        userNameElement.textContent = userInfo.name || userInfo.username || '用户';
        // 标记为非首次访问
        isFirstAccess = false;
        
        // 可以根据用户角色更新UI
        if (userInfo.role === USER_ROLE.STUDENT) {
            // 学生特定的UI更新
        } else if (userInfo.role === USER_ROLE.TEACHER || userInfo.role === USER_ROLE.PARENT) {
            // 教师/家长特定的UI更新
        }
    }
}

/**
 * 从URL获取学生姓名参数
 */
function getStudentNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('studentName');
}

/**
 * 初始化学生信息，更新UI显示
 */
function initStudentInfo() {
    // 首先尝试从URL参数获取学生姓名
    const studentName = getStudentNameFromUrl();
    const userNameElement = document.getElementById('user-name');
    
    if (studentName && userNameElement) {
        // 更新用户名显示
        userNameElement.textContent = studentName;
        
        // 保存到localStorage，以便页面刷新后仍能保持登录状态
        const userInfo = {
            role: USER_ROLE.STUDENT,
            name: studentName
        };
        saveUserLoginState(userInfo);
    } else {
        // 如果URL中没有参数，尝试从localStorage获取
        checkUserLoginStatus();
    }
}

/**
 * 初始化所有用户相关功能
 */
function initUserFunctions() {
    // 首先初始化学生信息（优先从URL获取）
    initStudentInfo();
    
    // 初始化用户导航
    initUserNavigation();
}

// 导出功能（如果需要在其他地方使用）
window.userFunctions = {
    initUserFunctions,
    getUserLoginState,
    saveUserLoginState,
    clearUserLoginState,
    isUserLoggedIn,
    USER_ROLE
};

// 添加DOMContentLoaded事件监听器，确保页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化用户功能，包括用户菜单
    initUserFunctions();
});