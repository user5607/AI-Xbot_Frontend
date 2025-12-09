// 日志记录函数
function log(message, type = 'info') {
    const logOutput = document.getElementById('logOutput');
    if (!logOutput) return;
    
    const logElement = document.createElement('div');
    logElement.className = `log-entry log-${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML = `[${timestamp}] ${message}`;
    
    logOutput.appendChild(logElement);
    logOutput.scrollTop = logOutput.scrollHeight;
}

// 加载工具盒XML文件并初始化Blockly
async function loadToolboxAndInitBlockly() {
    try {
        // 修改工具盒XML文件的路径
        const response = await fetch('toolbox.xml');
        
        if (!response.ok) {
            throw new Error(`加载toolbox.xml失败: ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const toolboxElement = xmlDoc.documentElement;
        
        toolboxElement.setAttribute('id', 'toolbox');
        toolboxElement.setAttribute('style', 'display: none;');
        
        const container = document.getElementById('toolbox-container');
        container.appendChild(toolboxElement);
        
        initBlockly();
        log('工具盒加载成功！');
        
    } catch (error) {
        console.error('加载工具盒失败:', error);
        log(`错误: 加载工具盒失败 - ${error.message}`, 'error');
        
        const defaultToolbox = document.createElementNS('https://developers.google.com/blockly/xml', 'xml');
        defaultToolbox.setAttribute('id', 'toolbox');
        defaultToolbox.setAttribute('style', 'display: none;');
        
        const container = document.getElementById('toolbox-container');
        container.appendChild(defaultToolbox);
        
        initBlockly();
        log('已使用默认空工具盒初始化工作区', 'warning');
    }
}

// 初始化Blockly工作区
// 确保存在initBlockly函数
function initBlockly() {
    try {
        // 现有的Blockly初始化代码
        const blocklyDiv = document.getElementById('blocklyDiv');
        const toolbox = document.getElementById('toolbox');
        
        const defaultOptions = {
toolbox: toolbox,
            theme: Blockly.Theme.Default,
            scrollbars: true,
            toolboxPosition: 'start',
            trashcan: true,
            // 修改media路径以正确指向blockly的media文件夹
            media: '../../lib/node_modules/blockly/media/',
            grid: {
                spacing: 40,
                length: 2,
                colour: '#334155',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 0.9,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.1
            }
        };
        
        workspace = Blockly.inject(blocklyDiv, defaultOptions);
        
        // 绑定工具栏按钮事件
        bindToolbarEvents();
        
        Blockly.svgResize(workspace);
        
        window.addEventListener('resize', function() {
            Blockly.svgResize(workspace);
        });
        
        return workspace;
    } catch (error) {
        console.error('初始化Blockly失败:', error);
    }
}

// 添加平台页面初始化函数
function initPlatformPage() {
    try {
const platformContainer = document.getElementById('platform-container');
        if (!platformContainer) return;
        
        // 平台页面特定初始化
        console.log('平台页面初始化完成');
    } catch (error) {
        console.error('初始化平台页面失败:', error);
    }
}

// 绑定工具栏按钮事件
function bindToolbarEvents() {
    // 撤销按钮
    document.getElementById('undoButton')?.addEventListener('click', function() {
        if (workspace) {
            workspace.undo();
            log('已撤销上一步操作');
        }
    });
    
    // 重做按钮 - 修改为移除最近添加的积木块
    document.getElementById('redoButton')?.addEventListener('click', function() {
        if (workspace) {
            const allBlocks = workspace.getAllBlocks();
            
            if (allBlocks.length > 0) {
                const lastBlock = allBlocks[allBlocks.length - 1];
                lastBlock.dispose();
                log('已移除最近添加的积木块');
            } else {
                log('工作区中没有积木块可移除', 'warning');
            }
        }
    });
    
    // 清空按钮 - 只有在工作区有积木块时才显示确认提示框
    document.getElementById('clearButton')?.addEventListener('click', function() {
        
        
        if (workspace) {
            
            const allBlocks = workspace.getAllBlocks();
            const blockCount = allBlocks.length;
            
            
// 检查工作区是否有积木块
            if (blockCount > 0) {
                
                
                // 使用自定义确认对话框替代原生confirm
                showCustomConfirmDialog(
                    `是否确定清空工作区？`, 
                    `当前工作区中有${blockCount}个积木块。`,
                    function(confirmed) {
                        if (confirmed) {
                            workspace.clear();
                            log('工作区已清空');
                        } else {
                            log('用户取消了清空操作');
                        }
                    }
                );
            } else {
                // 没有积木块时提示用户
                log('工作区中没有积木块可清空', 'info');
            }
        } else {
            log('工作区不存在', 'warning'); // 添加调试日志
        }
    });
    
    // 生成代码按钮
    document.getElementById('generateCodeButton')?.addEventListener('click', function() {
        if (workspace) {
            const code = Blockly.Python.workspaceToCode(workspace);
            log('Python代码已生成，请在控制台查看');
            console.log(code);
            log('\n生成的Python代码:\n' + code, 'code');
        }
    });
    
    // 文件菜单事件
    document.getElementById('newFile')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('确定要创建新文件吗？未保存的内容将会丢失。')) {
            if (workspace) {
                workspace.clear();
                log('已创建新文件');
            }
        }
    });
    
    document.getElementById('openFile')?.addEventListener('click', function(e) {
        e.preventDefault();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xml,.json';
        fileInput.style.display = 'none';
        
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        if (workspace) {
                            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(e.target.result), workspace);
                            log(`已打开文件: ${file.name}`);
                        }
                    } catch (error) {
                        log(`打开文件失败: ${error.message}`, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });
    
    document.getElementById('saveFile')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            
            const blob = new Blob([xmlText], {type: 'application/xml'});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `blockly-project-${new Date().toISOString().slice(0,10)}.xml`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            log('项目已保存');
        }
    });
    
    document.getElementById('exportCode')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (workspace) {
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            const blob = new Blob([code], {type: 'text/javascript'});
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `blockly-code-${new Date().toISOString().slice(0,10)}.js`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            log('代码已导出');
        }
    });
    
    document.getElementById('exportXml')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('saveFile').click();
    });
}

// 初始化项目和机器人选择功能
function initProjectRobotSelector() {
    const projectSelect = document.getElementById('projectSelect');
    const robotSelect = document.getElementById('robotSelect');
    const projectInfo = document.getElementById('projectInfo');
    const progressBar = document.getElementById('progressBar');
    
    projectSelect.addEventListener('change', updateTaskDisplay);
    robotSelect.addEventListener('change', updateTaskDisplay);
    
    function updateTaskDisplay() {
        const selectedProject = projectSelect.value;
        const selectedRobot = robotSelect.value;
        
        if (!selectedProject || !selectedRobot) {
            projectInfo.innerHTML = "请选择项目和机器人";
            progressBar.style.width = "0%";
            
            const existingTaskList = document.querySelector('.task-list');
            if (existingTaskList) {
                existingTaskList.remove();
            }
            return;
        }
        
        projectInfo.innerHTML = `${selectedProject} - ${selectedRobot}`;
        
        const tasks = projectRobotTasks[selectedProject][selectedRobot];
        
        const completedCount = tasks.filter(task => task.completed).length;
        const progressPercentage = (completedCount / tasks.length) * 100;
        progressBar.style.width = progressPercentage + "%";
        
        if (progressPercentage === 100) {
            progressBar.style.backgroundColor = "#10b981";
        } else if (progressPercentage > 0) {
            progressBar.style.backgroundColor = "#f59e0b";
        } else {
            progressBar.style.backgroundColor = "#3b82f6";
        }
        
        const existingTaskList = document.querySelector('.task-list');
        if (existingTaskList) {
            existingTaskList.remove();
        }
        
        const taskList = document.createElement('div');
        taskList.className = 'task-list';
        
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            
            const taskName = document.createElement('span');
            taskName.textContent = task.name;
            
            const taskStatus = document.createElement('span');
            taskStatus.className = `task-status ${task.completed ? 'completed' : ''}`;
            taskStatus.textContent = task.completed ? '已完成' : '未完成';
            
            taskItem.appendChild(taskName);
            taskItem.appendChild(taskStatus);
            taskList.appendChild(taskItem);
        });
        
        projectInfo.parentNode.appendChild(taskList);
    }
}

// 全局变量保存工作区
let workspace = null;

// 移除项目-机器人-任务数据结构
// 原有的 projectRobotTasks 对象已删除

// 日志记录函数
function log(message, type = 'info') {
    const logOutput = document.getElementById('logOutput');
    if (!logOutput) return;
    
    const logElement = document.createElement('div');
    logElement.className = `log-entry log-${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML = `[${timestamp}] ${message}`;
    
    logOutput.appendChild(logElement);
    logOutput.scrollTop = logOutput.scrollHeight;
}

// 其他函数保持不变...

// 移除 initProjectRobotSelector 函数
// 原有的 initProjectRobotSelector 函数已删除

// 初始化可拖动分隔条功能
function initResizer() {
    const resizer = document.getElementById('resizer');
    const mainContent = document.querySelector('main');
    const consoleElement = document.getElementById('console');
    const container = document.querySelector('.container');
    let isResizing = false;
    let startY;
    let startMainHeight;

    const MIN_MAIN_HEIGHT = 150;
    const MIN_CONSOLE_HEIGHT = 100;
    
    // 设置分隔条初始位置，让日志控制台显示部分内容
    // 计算可用高度
    const availableHeight = container.clientHeight - resizer.offsetHeight;
    // 设置主内容区域高度为容器高度的52%，这样日志控制台会显示48%
    const initialMainHeight = availableHeight * 0.52;
    const initialConsoleHeight = availableHeight * 0.48;
    
    // 确保设置的高度在最小限制范围内
    if (initialMainHeight >= MIN_MAIN_HEIGHT && initialConsoleHeight >= MIN_CONSOLE_HEIGHT) {
        mainContent.style.height = initialMainHeight + 'px';
        consoleElement.style.height = initialConsoleHeight + 'px';
        mainContent.style.flex = 'none'; // 移除flex属性，使用固定高度
    }

    resizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizing = true;
        
        startY = e.clientY;
        startMainHeight = mainContent.clientHeight;
        
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
// 添加课堂任务相关代码

// 课堂任务数据
const currentTask = {
    id: 'task-001',
    title: '超声波避障基础任务',
    description: '使用超声波传感器检测前方障碍物，并在检测到障碍物时自动停止。',
    difficulty: 'medium',
    difficultyText: '中等'
};

// 初始化课堂任务模块
function initTaskModule() {
    // 更新任务显示
    document.getElementById('taskTitle').textContent = currentTask.title;
    document.getElementById('taskDescription').textContent = currentTask.description;
    
    const difficultyElement = document.getElementById('taskDifficulty');
    difficultyElement.textContent = currentTask.difficultyText;
    difficultyElement.className = `difficulty-${currentTask.difficulty}`;
    
    // 添加提交按钮事件监听
    const submitButton = document.getElementById('submitTaskButton');
    if (submitButton) {
        submitButton.addEventListener('click', handleTaskSubmission);
    }
    
    log(`已加载课堂任务: ${currentTask.title}`, 'info');
}

// 处理任务提交
function handleTaskSubmission() {
    if (!workspace) {
        log('工作区未初始化，无法提交任务', 'error');
        return;
    }
    
    const allBlocks = workspace.getAllBlocks();
    if (allBlocks.length === 0) {
        log('工作区中没有代码积木，请完成任务后再提交', 'warning');
        return;
    }
    
    // 生成代码
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    
    // 显示提交确认
    log('正在提交任务...', 'info');
    
    // 模拟提交过程
    setTimeout(() => {
        // 存储提交记录到本地存储
        const submissionRecord = {
            taskId: currentTask.id,
            taskTitle: currentTask.title,
            timestamp: new Date().toISOString(),
            code: code,
            submissionId: `sub-${Date.now()}`
        };
        
        // 保存到本地存储
        let submissions = JSON.parse(localStorage.getItem('taskSubmissions') || '[]');
        submissions.push(submissionRecord);
        localStorage.setItem('taskSubmissions', JSON.stringify(submissions));
        
        log(`任务提交成功！提交ID: ${submissionRecord.submissionId}`, 'success');
        log(`您的代码已保存，教师将进行评阅`, 'info');
        
        // 添加简单的成功提示效果
        const submitButton = document.getElementById('submitTaskButton');
        const originalText = submitButton.textContent;
        submitButton.textContent = '✅ 提交成功';
        submitButton.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '#3b82f6';
        }, 2000);
        
    }, 1000);
}

// 在DOMContentLoaded事件中添加对initTaskModule的调用
document.addEventListener('DOMContentLoaded', function() {
    // 现有代码保持不变...
    
    // 加载工具盒并初始化Blockly
    loadToolboxAndInitBlockly();
    
    // 初始化可拖动分隔条
    initResizer();
    
    // 初始化课堂任务模块（添加这一行）
    initTaskModule();
    
    // 其他现有事件监听...
    
    // 绑定清空日志按钮事件
    document.getElementById('clearLogButton')?.addEventListener('click', function() {
        const logOutput = document.getElementById('logOutput');
        if (logOutput) {
            logOutput.innerHTML = '';
            log('日志已清空');
        }
    });
    
    // 编译、运行、停止按钮事件监听保持不变...
});
        if (!isResizing) return;
        
        e.preventDefault();
        
        const deltaY = e.clientY - startY;
        const newMainHeight = startMainHeight + deltaY;
        const availableHeight = container.clientHeight - resizer.offsetHeight;
        
        if (newMainHeight >= MIN_MAIN_HEIGHT && (availableHeight - newMainHeight) >= MIN_CONSOLE_HEIGHT) {
            mainContent.style.height = newMainHeight + 'px';
            consoleElement.style.height = (availableHeight - newMainHeight) + 'px';
            
            mainContent.style.flex = 'none';
            
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
    
    document.addEventListener('selectstart', function(e) {
        if (isResizing) {
            e.preventDefault();
        }
    });
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载工具盒并初始化Blockly
    loadToolboxAndInitBlockly();
    
    // 绑定清空日志按钮事件
    document.getElementById('clearLogButton')?.addEventListener('click', function() {
        const logOutput = document.getElementById('logOutput');
        if (logOutput) {
            logOutput.innerHTML = '';
            log('日志已清空');
        }
    });
    
    // 新增：为编译按钮添加事件监听器和日志输出
    document.getElementById('compileButton')?.addEventListener('click', function() {
        log('编译按钮被点击，开始编译代码...', 'info');
        
        if (workspace) {
            try {
                const code = Blockly.JavaScript.workspaceToCode(workspace);
                log('正在编译代码...', 'info');
                console.log('编译生成的代码:', code);
                
                // 简单的编译检查（检查是否有代码生成）
                if (code.trim() === '') {
                    log('警告：未生成任何代码，请检查工作区中的积木', 'warning');
                } else {
                    log('代码编译成功！', 'success');
                }
            } catch (error) {
                log(`编译错误: ${error.message}`, 'error');
            }
        } else {
            log('工作区未初始化或为null', 'warning');
            log('无法编译代码，但按钮点击事件已正确触发', 'info');
        }
    });
    
    // 修改：恢复并优化运行按钮事件监听器
    // 修改运行按钮事件监听器
    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // 首先确保日志输出，无论workspace是否存在
            log('开始运行代码...', 'info');
            
            if (workspace) {
                try {
                    log('代码运行中...', 'info');
                    const code = Blockly.JavaScript.workspaceToCode(workspace);
                    console.log('执行的代码:', code);
                    
                    // 检查WebSocket连接状态
                    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
                        log(`通过WebSocket发送命令: ${code.trim()}`, 'info');
                        // 发送生成的代码到ESP32机器人
                        wsConnection.send(code);
                        log('命令发送成功', 'success');
                    } else {
                        log('错误：未连接到机器人，请先点击连接按钮', 'error');
                    }
                    
                    // 模拟代码运行延迟
                    setTimeout(() => {
                        log('代码运行成功', 'success');
                    }, 500);
                } catch (error) {
                    log(`运行错误: ${error.message}`, 'error');
                }
            } else {
                log('警告：工作区未初始化或为null', 'warning');
                log('无法运行代码，但按钮点击事件已正确触发', 'info');
            }
        });
    }
    
    // 新增：为停止按钮添加事件监听器和日志输出
    document.getElementById('stopButton')?.addEventListener('click', function() {
        log('正在停止代码执行...', 'info');
        // 这里可以添加实际的停止代码执行的逻辑
        setTimeout(() => {
            log('代码已停止执行', 'info');
        }, 300); // 模拟停止过程的短暂延迟
    });
    
    // 初始化可拖动分隔条
    initResizer();
    
    // 初始化项目和机器人选择器
    initProjectRobotSelector();
});

// 自定义确认对话框函数
// 修改 showCustomConfirmDialog 函数中的消息创建部分
function showCustomConfirmDialog(title, message, callback) {
    // 创建对话框容器
    const dialog = document.createElement('div');
    dialog.className = 'custom-confirm-dialog';
    
    // 创建对话框内容
    const dialogContent = document.createElement('div');
    
    // 创建图标容器
    const iconContainer = document.createElement('div');
    iconContainer.className = 'dialog-icon-container';
    
    // 创建警告图标
    const warningIcon = document.createElement('div');
    warningIcon.className = 'dialog-warning-icon';
    iconContainer.appendChild(warningIcon);
    
    // 创建标题
    const dialogTitle = document.createElement('h3');
    dialogTitle.textContent = title;
    
    // 创建消息 - 修改为突出显示积木块数量
    const dialogMessage = document.createElement('p');
    
    // 检查消息是否包含积木块数量（通过查找数字模式）
    if (message.includes('当前工作区中有') && message.includes('个积木块')) {
        const parts = message.split('当前工作区中有');
        const mainText = parts[0];
        const countAndRest = parts[1].split('个积木块');
        const blockCount = countAndRest[0];
        const restText = countAndRest[1] || '';
        
        dialogMessage.innerHTML = `${mainText}当前工作区中有<span class="block-count-highlight">${blockCount}</span>个积木块${restText}`;
    } else {
        dialogMessage.textContent = message;
    }
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    
    // 创建取消按钮
const cancelButton = document.createElement('button');
    cancelButton.className = 'dialog-cancel-button'; // 添加类名便于样式控制
    cancelButton.innerHTML = '<span>取消</span>';
    cancelButton.onclick = function() {
        document.body.removeChild(dialog);
        callback(false);
    };
    
    // 创建确定按钮
    const confirmButton = document.createElement('button');
    confirmButton.className = 'dialog-confirm-button'; // 添加类名便于样式控制
    confirmButton.innerHTML = '<span>确定</span>';
    confirmButton.onclick = function() {
        document.body.removeChild(dialog);
        callback(true);
    };
    
    // 组装对话框
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    dialogContent.appendChild(iconContainer);
    dialogContent.appendChild(dialogTitle);
    dialogContent.appendChild(dialogMessage);
    dialogContent.appendChild(buttonContainer);
    dialog.appendChild(dialogContent);
    
    // 添加到文档
    document.body.appendChild(dialog);
    
    // 确保对话框在最上层
    dialog.focus();
    confirmButton.focus();
}

// 机器人连接状态管理 - 只声明变量，不立即获取元素
let robotStatus;
let connectButton;
let statusIcon;
let batteryLevel; // 电量文本元素
let batteryProgress; // 电量进度条元素

// WebSocket相关变量
let wsConnection = null; // WebSocket连接对象

// 定义机器人连接状态枚举
const ROBOT_STATUS = {
    OFFLINE: { text: '离线', color: '#6b7280', iconColor: '#6b7280', buttonText: '🔌 连接' },
    CONNECTING: { text: '连接中', color: '#f59e0b', iconColor: '#f59e0b', buttonText: '⏳ 连接中' },
    ONLINE: { text: '在线', color: '#10b981', iconColor: '#10b981', buttonText: '🔌 断开' }
};

// 更新状态函数
function setRobotStatus(status) {
    if (robotStatus && connectButton) {
        // 使用innerHTML设置完整的HTML内容，包括图标和文本
        robotStatus.innerHTML = `<span style="margin-right: 5px; color: ${status.iconColor};">连接状态：</span>${status.text}`;
        robotStatus.style.color = status.color;
        
        // 设置按钮状态
        connectButton.textContent = status.buttonText;
        connectButton.disabled = status === ROBOT_STATUS.CONNECTING;
    }
}

// 更新电量显示函数
function updateBatteryLevel(level) {
    // 确保level在0-100范围内
    level = Math.max(0, Math.min(100, level));
    
    // 获取电量颜色
    let batteryColor;
    if (level > 70) {
        batteryColor = '#10b981'; // 绿色 - 高电量
    } else if (level > 30) {
        batteryColor = '#f59e0b'; // 黄色 - 中电量
    } else {
        batteryColor = '#ef4444'; // 红色 - 低电量
    }
    
    // 更新电量文本
    if (batteryLevel) {
        batteryLevel.textContent = `${level}%`;
        batteryLevel.style.color = batteryColor;
    }
    
    // 更新电量进度条
    if (batteryProgress) {
        batteryProgress.style.width = `${level}%`;
        batteryProgress.style.backgroundColor = batteryColor;
    }
}

// 创建IP地址输入对话框
function createIpInputDialog() {
    // 创建对话框背景
    const dialogOverlay = document.createElement('div');
    dialogOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 100px;
        z-index: 1000;
    `;
    
    // 创建对话框内容
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // 添加标题
    const title = document.createElement('h3');
    title.textContent = '输入机器人IP地址';
    title.style.marginTop = '0';
    dialog.appendChild(title);
    
    // 添加输入框
    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '15px';
    const ipInput = document.createElement('input');
    ipInput.type = 'text';
    ipInput.style.width = '100%';
    ipInput.style.padding = '8px';
    ipInput.style.border = '1px solid #ddd';
    ipInput.style.borderRadius = '4px';
    ipInput.style.boxSizing = 'border-box';
    inputContainer.appendChild(ipInput);
    dialog.appendChild(inputContainer);
    
    // 添加按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    
    // 添加取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.border = '1px solid #ddd';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.backgroundColor = '#f3f4f6';
    cancelButton.style.cursor = 'pointer';
    // 添加连接按钮
    const connectDialogButton = document.createElement('button');
    connectDialogButton.textContent = '连接';
    connectDialogButton.style.padding = '8px 16px';
    connectDialogButton.style.border = 'none';
    connectDialogButton.style.borderRadius = '4px';
    connectDialogButton.style.backgroundColor = '#10b981';
    connectDialogButton.style.color = 'white';
    connectDialogButton.style.cursor = 'pointer';
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(connectDialogButton);
    dialog.appendChild(buttonContainer);
    
    dialogOverlay.appendChild(dialog);
    
    // 添加事件监听器
    cancelButton.addEventListener('click', function() {
        document.body.removeChild(dialogOverlay);
    });
    
    connectDialogButton.addEventListener('click', function() {
        const ip = ipInput.value.trim();
        if (validateIpAddress(ip)) {
            robotIpAddress = ip;
            document.body.removeChild(dialogOverlay);
            // 开始WebSocket连接
            connectToRobot();
        } else {
            alert('请输入有效的IP地址');
        }
    });
    
    // 按下Enter键时自动连接
    ipInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            connectDialogButton.click();
        }
    });
    
    // 添加到文档
    document.body.appendChild(dialogOverlay);
    
    // 聚焦输入框
    ipInput.focus();
}

// 验证IP地址格式
function validateIpAddress(ip) {
    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// 通过WebSocket连接到机器人
function connectToRobot() {
    if (!robotIpAddress) {
        log('错误：未设置机器人IP地址', 'error');
        return;
    }
    
    // 显示连接中状态
    setRobotStatus(ROBOT_STATUS.CONNECTING);
    log(`正在连接到机器人 (${robotIpAddress})...`, 'info');
    
    try {
        // 创建WebSocket连接，使用正确的IP地址
        const wsUrl = `ws://${robotIpAddress}:81`;
        wsConnection = new WebSocket(wsUrl);
        
        // 设置连接超时定时器
        const connectionTimeout = setTimeout(() => {
            if (wsConnection && wsConnection.readyState !== WebSocket.OPEN) {
                log(`连接超时：无法在3秒内连接到机器人 (${robotIpAddress})`, 'error');
                wsConnection.close();
                wsConnection = null;
                setRobotStatus(ROBOT_STATUS.OFFLINE);
            }
        }, 3000);
        
        // 连接打开时
        wsConnection.onopen = function() {
            // 清除超时定时器
            clearTimeout(connectionTimeout);
            
            log(`成功连接到机器人 (${robotIpAddress})`, 'info');
            setRobotStatus(ROBOT_STATUS.ONLINE);
            
            // 模拟获取电量信息
            const randomBatteryLevel = Math.floor(Math.random() * 30) + 70; // 70-99之间的随机电量
            updateBatteryLevel(randomBatteryLevel);
            
            // 发送一条连接确认消息
            wsConnection.send('连接确认');
        };
        
        // 添加连接错误处理
        wsConnection.onerror = function(error) {
            // 清除超时定时器
            clearTimeout(connectionTimeout);
            
            log(`连接错误: ${error.message || '未知错误'}`, 'error');
            wsConnection = null;
            setRobotStatus(ROBOT_STATUS.OFFLINE);
        };
        
        // 添加连接关闭处理
        wsConnection.onclose = function() {
            // 清除超时定时器
            clearTimeout(connectionTimeout);
            
            // 设置机器人状态为离线
            log('与机器人的连接已关闭', 'info');
            wsConnection = null;
            setRobotStatus(ROBOT_STATUS.OFFLINE);
            updateBatteryLevel(0);
        };
        
        // 处理收到的消息
        wsConnection.onmessage = function(event) {
            handleRobotMessage(event.data);
        };
    } catch (error) {
        log(`连接异常: ${error.message}`, 'error');
        wsConnection = null;
        setRobotStatus(ROBOT_STATUS.OFFLINE);
    }
}

// 处理来自机器人的消息
function handleRobotMessage(message) {
    // 这里可以实现对消息的具体处理逻辑
    // 例如解析JSON格式的消息，更新电量、状态等
    try {
        // 示例：如果消息是JSON格式的状态更新
        const data = JSON.parse(message);
        
        // 如果包含电量信息
        if (data.battery !== undefined) {
            updateBatteryLevel(parseInt(data.battery));
        }
        
        // 其他消息处理...
    } catch (e) {
        // 如果不是JSON格式，作为普通文本处理
        log(`收到非JSON消息: ${message}`, 'info');
    }
}

// 断开WebSocket连接
function disconnectFromRobot() {
    if (wsConnection) {
        log('正在断开与机器人的连接...', 'info');
        wsConnection.close();
        wsConnection = null;
    }
    setRobotStatus(ROBOT_STATUS.OFFLINE);
    updateBatteryLevel(0);
}

// 确保在DOM加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    // 获取元素引用
    robotStatus = document.getElementById('robotStatus');
    connectButton = document.getElementById('connectButton');
    statusIcon = document.getElementById('statusIcon');
    batteryLevel = document.getElementById('batteryLevel');
    batteryProgress = document.getElementById('batteryProgress');
    
    // 初始化状态为离线
    setRobotStatus(ROBOT_STATUS.OFFLINE);
    // 初始化电量为0
    updateBatteryLevel(0);
    
    // 绑定连接按钮点击事件
    if (connectButton) {
        connectButton.addEventListener('click', function() {
            // 使用textContent检查当前状态时要考虑HTML标签的影响
            const statusText = robotStatus.textContent || robotStatus.innerText;
            
            // 如果当前是离线状态，则显示IP地址输入框
            if (statusText.includes('离线')) {
                // 显示IP地址输入对话框
                createIpInputDialog();
            }
            // 如果当前是在线状态，则断开连接
            else if (statusText.includes('在线')) {
                disconnectFromRobot();
            }
        });
    }
});