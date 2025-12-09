// 挑战任务页面初始化
function initChallengePage() {
    try {
        const challengeContainer = document.getElementById('challenge-container');
        if (!challengeContainer) return;
        
        // 挑战任务页面特定初始化
        console.log('挑战任务页面初始化完成');
    } catch (error) {
        console.error('初始化挑战任务页面失败:', error);
    }
}

// 开始挑战按钮点击事件
const startButtons = document.querySelectorAll('#challenge-page button.bg-blue-600');
startButtons.forEach(button => {
    button.addEventListener('click', function() {
        const challengeName = this.closest('.flex').querySelector('h3').textContent;
        log(`🎯 开始挑战: ${challengeName}`);
        
        // 选择对应的项目并切换到编程平台
        selectProject(challengeName);
        showPage('platform');
        
        // 加载挑战相关的初始代码
        loadChallengeCode(challengeName);
    });
});

// 分页按钮点击事件
const paginationButtons = document.querySelectorAll('#challenge-page .mt-10 button');
paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
        const page = this.textContent.trim();
        log(`📄 切换到第 ${page} 页挑战`);
        // 这里可以添加切换分页的逻辑
    });
});

// 加载挑战相关代码
function loadChallengeCode(challengeName) {
    // 根据挑战名称加载相应的初始代码
    log(`📂 加载挑战代码: ${challengeName}`);
    
    // 清空当前工作区
    if (workspace) {
        workspace.clear();
    }
    
    // 这里可以添加为不同挑战加载初始代码块的逻辑
    switch(challengeName) {
        case '正方形路径':
            initSquarePathChallenge();
            break;
        case '障碍物绕行':
            initObstacleAvoidanceChallenge();
            break;
        case '跟随引导线':
            initLineFollowingChallenge();
            break;
        case '音乐播放器':
            initMusicPlayerChallenge();
            break;
        default:
            log(`⚠️ 挑战代码 "${challengeName}" 未找到`);
    }
}

// 初始化正方形路径挑战
function initSquarePathChallenge() {
    // 这里添加正方形路径挑战的初始代码块
    log('✅ 已初始化正方形路径挑战');
}

// 初始化障碍物绕行挑战
function initObstacleAvoidanceChallenge() {
    // 这里添加障碍物绕行挑战的初始代码块
    log('✅ 已初始化障碍物绕行挑战');
}

// 初始化跟随引导线挑战
function initLineFollowingChallenge() {
    // 这里添加跟随引导线挑战的初始代码块
    log('✅ 已初始化跟随引导线挑战');
}

// 初始化音乐播放器挑战
function initMusicPlayerChallenge() {
    // 这里添加音乐播放器挑战的初始代码块
    log('✅ 已初始化音乐播放器挑战');
}

// 页面显示时初始化
document.getElementById('challenge-page').addEventListener('show', initChallengePage);