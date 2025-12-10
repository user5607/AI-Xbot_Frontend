// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn-header');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const tabs = document.querySelectorAll('.tab');
    const studentFields = document.getElementById('student-login-fields');
    const teacherFields = document.getElementById('teacher-login-fields');
    const parentFields = document.getElementById('parent-login-fields');
    const loginForm = document.getElementById('landing-login-form');
    const successToast = document.getElementById('success-toast');
    
    // 打开登录模态框
    loginBtn.addEventListener('click', function() {
        loginModal.classList.add('show');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭登录模态框（取消按钮功能）
    closeModalBtn.addEventListener('click', function() {
        loginModal.classList.remove('show');
        // 恢复背景滚动
        document.body.style.overflow = '';
    });
    
    // 点击模态框背景关闭模态框
    loginModal.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // 按ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && loginModal.classList.contains('show')) {
            loginModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // 身份切换逻辑
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有标签的活跃状态
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-blue-600');
                t.classList.add('text-white/80');
            });
            
            // 添加当前标签的活跃状态
            tab.classList.add('active', 'bg-blue-600');
            tab.classList.remove('text-white/80');
            
            // 隐藏所有表单字段
            studentFields.classList.add('hidden');
            teacherFields.classList.add('hidden');
            parentFields.classList.add('hidden');
            
            // 显示对应的表单字段
            const role = tab.getAttribute('data-role');
            if (role === 'student') {
                studentFields.classList.remove('hidden');
            } else if (role === 'teacher') {
                teacherFields.classList.remove('hidden');
            } else if (role === 'parent') {
                parentFields.classList.remove('hidden');
            }
        });
    });
    
    // 登录表单提交处理
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 获取当前激活的标签
        const activeTab = document.querySelector('.tab.active');
        // 第80-150行：学生登录逻辑
        const role = activeTab.getAttribute('data-role');
        
        // Cloudflare Workers后端API地址
        const API_URL = 'https://aixbot-worker.3161769691.workers.dev';
        
        // 根据不同角色进行表单验证和提交
        if (role === 'student') {
            // 学生登录逻辑 - 加强验证
            const schoolInput = document.getElementById('school');
            const nameInput = document.getElementById('student-name');
            const studentIdInput = document.getElementById('student-id');
            const passwordInput = document.getElementById('student-password');
            
            // 确保所有元素都存在
            if (!schoolInput || !nameInput || !studentIdInput || !passwordInput) {
                console.error('无法找到所有学生表单元素');
                alert('系统错误，请刷新页面重试！');
                return;
            }
            
            const school = schoolInput.value.trim();
            const name = nameInput.value.trim();
            const studentId = studentIdInput.value.trim();
            const password = passwordInput.value.trim();
            
            // 检查字段是否为空
            if (!school || !name || !studentId || !password) {
                console.log('学生登录信息不完整:', {school, name, studentId, password});
                // 使用confirm代替alert，更明显
                confirm('提示：请填写完整的登录信息！');
                // 聚焦到第一个空字段
                if (!school) schoolInput.focus();
                else if (!name) nameInput.focus();
                else if (!studentId) studentIdInput.focus();
                else if (!password) passwordInput.focus();
                return;
            }
            
            try {
                console.log('发送学生登录请求:', {role: 'student', username: studentId, school: school});
                // 调用后端API进行登录验证
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'student',
                        username: studentId,
                        password: password,
                        school: school
                    })
                });
                
                console.log('学生登录响应状态:', response.status);
                const data = await response.json();
                console.log('学生登录响应数据:', data);
                
                if (data.success) {
                    console.log('学生登录成功，准备跳转:', `students/students.html?studentName=${encodeURIComponent(name)}`);
                    // 登录成功，保存用户信息到本地存储
                    const userInfo = {
                        role: 'student',
                        name: name,
                        studentId: studentId,
                        school: school
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    // 跳转到students.html页面
                    window.location.href = `students/students.html?studentName=${encodeURIComponent(name)}`;
                } else {
                    // 登录失败，显示错误信息
                    confirm('登录失败：' + (data.message || '未知错误'));
                }
            } catch (error) {
                console.error('学生登录请求失败:', error);
                confirm('网络错误，请检查网络连接后重试！');
            }
        }
        
        // 教师登录逻辑
        else if (role === 'teacher') {
            // 教师登录逻辑 - 修改为姓名、工号、密码
            const nameInput = document.getElementById('teacher-name');
            const idInput = document.getElementById('teacher-id');
            const passwordInput = document.getElementById('teacher-password');
            
            // 确保所有元素都存在
            if (!nameInput || !idInput || !passwordInput) {
                console.error('无法找到所有教师表单元素');
                alert('系统错误，请刷新页面重试！');
                return;
            }
            
            const name = nameInput.value.trim();
            const id = idInput.value.trim();
            const password = passwordInput.value.trim();
            
            // 简单验证
            if (!name || !id || !password) {
                console.log('教师登录信息不完整:', {name, id, password});
                confirm('提示：请填写完整的登录信息！');
                // 聚焦到第一个空字段
                if (!name) nameInput.focus();
                else if (!id) idInput.focus();
                else if (!password) passwordInput.focus();
                return;
            }
            
            try {
                console.log('发送教师登录请求:', {role: 'teacher', username: id});
                // 调用后端API进行登录验证
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'teacher',
                        username: id, // 使用工号作为用户名
                        password: password
                    })
                });
                
                console.log('教师登录响应状态:', response.status);
                const data = await response.json();
                console.log('教师登录响应数据:', data);
                
                if (data.success) {
                    console.log('教师登录成功，准备跳转:', `teacher/teacher.html?teacherName=${encodeURIComponent(name)}`);
                    // 登录成功，保存用户信息到本地存储
                    const userInfo = {
                        role: 'teacher',
                        name: name,
                        teacherId: id
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    // 登录成功，直接跳转
                    window.location.href = `teacher/teacher.html?teacherName=${encodeURIComponent(name)}`;
                } else {
                    // 登录失败，显示错误信息
                    confirm('登录失败：' + (data.message || '未知错误'));
                }
            } catch (error) {
                console.error('教师登录请求失败:', error);
                confirm('网络错误，请检查网络连接后重试！');
            }
        }
        
        // 家长登录逻辑
        else if (role === 'parent') {
            // 家长登录逻辑
            const childNameInput = document.getElementById('child-name');
            const accountInput = document.getElementById('parent-account');
            const passwordInput = document.getElementById('parent-password');
            
            // 确保所有元素都存在
            if (!childNameInput || !accountInput || !passwordInput) {
                console.error('无法找到所有家长表单元素');
                alert('系统错误，请刷新页面重试！');
                return;
            }
            
            const childName = childNameInput.value.trim();
            const account = accountInput.value.trim();
            const password = passwordInput.value.trim();
            
            // 简单验证
            if (!childName || !account || !password) {
                console.log('家长登录信息不完整:', {childName, account, password});
                confirm('提示：请填写完整的登录信息！');
                // 聚焦到第一个空字段
                if (!childName) childNameInput.focus();
                else if (!account) accountInput.focus();
                else if (!password) passwordInput.focus();
                return;
            }
            
            try {
                console.log('发送家长登录请求:', {role: 'parent', username: account});
                // 调用后端API进行登录验证
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'parent',
                        username: account, // 使用账号作为用户名
                        password: password
                    })
                });
                
                console.log('家长登录响应状态:', response.status);
                const data = await response.json();
                console.log('家长登录响应数据:', data);
                
                if (data.success) {
                    console.log('家长登录成功，准备跳转:', `parents/parents.html?childName=${encodeURIComponent(childName)}`);
                    // 登录成功，保存用户信息到本地存储
                    const userInfo = {
                        role: 'parent',
                        account: account,
                        childName: childName
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    // 登录成功，直接跳转
                    window.location.href = `parents/parents.html?childName=${encodeURIComponent(childName)}`;
                } else {
                    // 登录失败，显示错误信息
                    confirm('登录失败：' + (data.message || '未知错误'));
                }
            } catch (error) {
                console.error('家长登录请求失败:', error);
                confirm('网络错误，请检查网络连接后重试！');
            }
        }
        
        // 调试代码已移至各自的角色登录逻辑内部
    });
    
    // 密码可见性切换功能
    const passwordToggles = document.querySelectorAll('.password-toggle');
    console.log('找到的密码切换按钮数量:', passwordToggles.length);
    
    passwordToggles.forEach(toggle => {
        console.log('为按钮添加点击事件:', toggle);
        toggle.addEventListener('click', () => {
            console.log('密码切换按钮被点击');
            const targetId = toggle.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            
            console.log('目标输入框ID:', targetId);
            console.log('目标输入框:', passwordInput);
            console.log('当前输入框类型:', passwordInput.type);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                console.log('切换为可见模式');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                console.log('切换为隐藏模式');
            }
        });
    });
});