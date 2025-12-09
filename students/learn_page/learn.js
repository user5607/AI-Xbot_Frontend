// 学习中心页面初始化
function initLearnPage() {
    try {
        const learnContainer = document.getElementById('learn-container');
        if (!learnContainer) return;
        
        // 学习中心页面特定初始化
        console.log('学习中心页面初始化完成');
    } catch (error) {
        console.error('初始化学习中心页面失败:', error);
    }
}

// 学习资源点击事件
const resourceLinks = document.querySelectorAll('#learn-page a');
resourceLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const resourceName = this.querySelector('span').textContent;
        log(`📚 查看学习资源: ${resourceName}`);
        // 这里可以添加加载学习资源的逻辑
    });
});

// 视频教程点击事件
const videoTutorials = document.querySelectorAll('#learn-page .flex.items-center.bg-\\[\\#1E293B\\]');
videoTutorials.forEach(tutorial => {
    tutorial.addEventListener('click', function() {
        const videoName = this.querySelector('h4').textContent;
        log(`▶️ 播放视频教程: ${videoName}`);
        // 这里可以添加播放视频的逻辑
    });
});

// 编程示例按钮点击事件
const exampleButtons = document.querySelectorAll('#learn-page button.bg-blue-600');
exampleButtons.forEach(button => {
    button.addEventListener('click', function() {
        const exampleName = this.closest('.flex').querySelector('h4').textContent;
        log(`🔍 查看编程示例: ${exampleName}`);
        // 切换到编程平台并加载示例
        showPage('platform');
        loadExampleCode(exampleName);
    });
});

// 加载示例代码
function loadExampleCode(exampleName) {
    // 根据示例名称加载相应的代码
    log(`📂 加载示例代码: ${exampleName}`);
    
    // 这里可以添加实际加载示例代码的逻辑
    switch(exampleName) {
        case '正方形巡逻':
            loadSquarePatrolExample();
            break;
        case '避障行走':
            loadObstacleAvoidanceExample();
            break;
        default:
            log(`⚠️ 示例代码 "${exampleName}" 未找到`);
    }
}

// 加载正方形巡逻示例
function loadSquarePatrolExample() {
    // 清空当前工作区
    workspace.clear();
    
    // 这里可以添加创建正方形巡逻代码块的逻辑
    log('✅ 已加载正方形巡逻示例代码');
}

// 加载避障行走示例
function loadObstacleAvoidanceExample() {
    // 清空当前工作区
    workspace.clear();
    
    // 这里可以添加创建避障行走代码块的逻辑
    log('✅ 已加载避障行走示例代码');
}

// 页面显示时初始化
document.getElementById('learn-page').addEventListener('show', initLearnPage);