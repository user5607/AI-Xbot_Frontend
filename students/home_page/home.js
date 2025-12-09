// 初始化Blockly工作区
let workspace;
let selectedRobot = "基础版机器人";
let selectedProject = "正方形路径挑战";

// 页面加载完成后初始化
window.onload = function() {
    // 初始化界面切换
    initPageNavigation();
    
    // 初始化首页交互
    initHomePage();
    
    // 初始化导航栏下拉菜单
    initNavigationDropdowns();
};

// 初始化页面导航
function initPageNavigation() {
    const homeLink = document.getElementById('home-link');
    const platformLink = document.getElementById('platform-link');
    const learnLink = document.getElementById('learn-link');
    const challengeLink = document.getElementById('challenge-link');
    const startProgrammingBtn = document.getElementById('start-programming-btn');
    const homePage = document.getElementById('home-page');
    const platformPage = document.getElementById('platform-page');
    const learnPage = document.getElementById('learn-page');
    const challengePage = document.getElementById('challenge-page');
    
    // 首页链接点击事件
    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showHomePage();
        updateNavigationActiveState(homeLink);
    });
    
    // 编程平台链接点击事件
    platformLink.addEventListener('click', function(e) {
        e.preventDefault();
        showPlatformPage();
        updateNavigationActiveState(platformLink);
    });
    
    // 学习中心链接点击事件
    learnLink.addEventListener('click', function(e) {
        e.preventDefault();
        showLearnPage();
        updateNavigationActiveState(learnLink);
        log('📚 跳转到学习中心');
    });
    
    // 挑战任务链接点击事件
    challengeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showChallengePage();
        updateNavigationActiveState(challengeLink);
        log('🎯 跳转到挑战任务');
    });
    
    // 开始编程按钮点击事件
    startProgrammingBtn.addEventListener('click', function() {
        showPlatformPage();
        updateNavigationActiveState(platformLink);
    });
    
    // 显示首页
    function showHomePage() {
        hideAllPages();
        homePage.classList.remove('hidden');
        homePage.classList.add('flex');
    }
    
    // 显示编程平台
    function showPlatformPage() {
        hideAllPages();
        platformPage.classList.remove('hidden');
        platformPage.classList.add('flex');
        
        // 初始化Blockly工作区（如果还未初始化）
        if (!workspace) {
            initBlockly();
        }
        
        // 更新当前项目信息
        updateCurrentProjectInfo();
    }
    
    // 显示学习中心
    function showLearnPage() {
        hideAllPages();
        learnPage.classList.remove('hidden');
        learnPage.classList.add('flex');
    }
    
    // 显示挑战任务
    function showChallengePage() {
        hideAllPages();
        challengePage.classList.remove('hidden');
        challengePage.classList.add('flex');
    }
    
    // 隐藏所有页面
    function hideAllPages() {
        homePage.classList.add('hidden');
        homePage.classList.remove('flex');
        platformPage.classList.add('hidden');
        platformPage.classList.remove('flex');
        learnPage.classList.add('hidden');
        learnPage.classList.remove('flex');
        challengePage.classList.add('hidden');
        challengePage.classList.remove('flex');
    }
    
    // 更新导航激活状态
    function updateNavigationActiveState(activeLink) {
        const navLinks = [homeLink, platformLink, learnLink, challengeLink];
        navLinks.forEach(link => {
            if (link === activeLink) {
                link.classList.add('text-blue-400', 'font-medium', 'border-b-2', 'border-blue-400', 'pb-1');
                link.classList.remove('text-white', 'hover:text-blue-400');
            } else {
                link.classList.remove('text-blue-400', 'font-medium', 'border-b-2', 'border-blue-400', 'pb-1');
                link.classList.add('text-white', 'hover:text-blue-400');
            }
        });
    }
}

// 初始化导航栏下拉菜单
function initNavigationDropdowns() {
    // 机器人选择下拉菜单
    const robotSelector = document.getElementById('robot-selector');
    const robotButton = robotSelector.querySelector('button');
    const robotDropdown = robotSelector.querySelector('div[class*="absolute"]');
    const robotOptions = robotSelector.querySelectorAll('.robot-option');
    
    // 项目选择下拉菜单
const projectSelector = document.getElementById('project-selector');
    const projectButton = projectSelector.querySelector('button');
    const projectDropdown = projectSelector.querySelector('div[class*="absolute"]');
    const projectOptions = projectSelector.querySelectorAll('.project-option');
    
    // 机器人选择按钮点击事件
    robotButton.addEventListener('click', function(e) {
e.stopPropagation();
        toggleDropdown(robotDropdown);
        closeDropdown(projectDropdown);
    });
    
    // 项目选择按钮点击事件
    projectButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(projectDropdown);
        closeDropdown(robotDropdown);
    });
    
// 点击其他区域关闭下拉菜单
    document.addEventListener('click', function() {
        closeDropdown(robotDropdown);
        closeDropdown(projectDropdown);
    });
    
    // 机器人选项点击事件
    robotOptions.forEach(option => {
        option.addEventListener('click', function() {
            const robotName = this.getAttribute('data-robot');
            selectRobot(robotName);
            closeDropdown(robotDropdown);
        });
    });
    
    // 项目选项点击事件
    projectOptions.forEach(option => {
        option.addEventListener('click', function() {
            const projectName = this.getAttribute('data-project');
            selectProject(projectName);
            closeDropdown(projectDropdown);
        });
    });
    
    // 切换下拉菜单显示状态
    function toggleDropdown(dropdown) {
        dropdown.classList.toggle('hidden');
    }
    
    // 关闭下拉菜单
    function closeDropdown(dropdown) {
        dropdown.classList.add('hidden');
    }
    
    // 选择机器人
    function selectRobot(robotName) {
        selectedRobot = robotName;
        document.getElementById('selected-robot').textContent = robotName;
        log(`🤖 选择了 ${robotName}`);
        
        // 更新首页的机器人选择状态
        updateHomePageRobotSelection(robotName);
        
        // 如果在编程平台页面，更新相关信息
        if (!document.getElementById('platform-page').classList.contains('hidden')) {
            log(`🔄 已切换到 ${robotName}`);
        }
    }
    
    // 选择项目
    function selectProject(projectName) {
        selectedProject = projectName;
        document.getElementById('selected-project').textContent = projectName;
        log(`📁 选择了项目 "${projectName}"`);
        
        // 更新首页的项目选择状态
        updateHomePageProjectSelection(projectName);
        
        // 如果在编程平台页面，更新相关信息
        if (!document.getElementById('platform-page').classList.contains('hidden')) {
            updateCurrentProjectInfo();
        }
    }
}

// 初始化首页
// 在initHomePage函数中添加项目编辑和删除功能
function initHomePage() {
    // 机器人选择
    const robotCards = document.querySelectorAll('.robot-option-card');
    robotCards.forEach(card => {
        card.addEventListener('click', function() {
            const robotName = this.getAttribute('data-robot');
            selectRobot(robotName);
        });
    });
    
    // 项目选择
    const projectCards = document.querySelectorAll('.project-option-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectName = this.getAttribute('data-project');
            selectProject(projectName);
        });
    });
    
    // 项目编辑按钮事件
    const editButtons = document.querySelectorAll('.edit-project-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡，避免触发卡片选择
            const projectName = this.getAttribute('data-project');
            editProject(projectName);
        });
    });
    
    // 项目删除按钮事件
    const deleteButtons = document.querySelectorAll('.delete-project-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡，避免触发卡片选择
            const projectName = this.getAttribute('data-project');
            deleteProject(projectName);
        });
    });
    
    // 新建项目按钮事件
    const createProjectBtn = document.querySelector('button:has(.fa-plus)');
    if (createProjectBtn) {
        createProjectBtn.addEventListener('click', function() {
            createNewProject();
        });
    }
}

// 编辑项目
function editProject(projectName) {
    log(`📝 编辑项目：${projectName}`);
    // 弹出编辑对话框
    const projectTitle = prompt('请输入项目名称:', projectName);
    if (projectTitle && projectTitle.trim() !== '') {
        // 这里可以添加实际的项目编辑逻辑
        log(`✅ 项目名称已更新为：${projectTitle}`);
        alert(`项目 "${projectName}" 已更新为 "${projectTitle}"`);
    }
}

// 删除项目
function deleteProject(projectName) {
    log(`🗑️ 删除项目：${projectName}`);
    if (confirm(`确定要删除项目 "${projectName}" 吗？此操作不可恢复。`)) {
        // 这里可以添加实际的项目删除逻辑
        log(`✅ 项目 "${projectName}" 已删除`);
        alert(`项目 "${projectName}" 已成功删除`);
        // 如果删除的是当前选中的项目，需要更新选中状态
        if (selectedProject === projectName) {
            // 选择第一个可用的项目或清除选择
            const firstProject = document.querySelector('.project-option-card');
            if (firstProject) {
                selectProject(firstProject.getAttribute('data-project'));
            }
        }
    }
}

// 创建新项目
function createNewProject() {
    log(`➕ 创建新项目`);
    const projectName = prompt('请输入新项目名称:');
    if (projectName && projectName.trim() !== '') {
        // 这里可以添加实际的项目创建逻辑
        log(`✅ 新项目 "${projectName}" 已创建`);
        alert(`新项目 "${projectName}" 已成功创建`);
        // 选择新创建的项目
        // selectProject(projectName);
    }
}

// 选择机器人
function selectRobot(robotName) {
    selectedRobot = robotName;
    
    // 更新导航栏中的机器人选择
    document.getElementById('selected-robot').textContent = robotName;
    
    // 更新首页的机器人选择状态
    updateHomePageRobotSelection(robotName);
}

// 选择项目
function selectProject(projectName) {
    selectedProject = projectName;
    
    // 更新导航栏中的项目选择
    document.getElementById('selected-project').textContent = projectName;
    
    // 更新首页的项目选择状态
    updateHomePageProjectSelection(projectName);
}

// 更新首页的机器人选择状态
function updateHomePageRobotSelection(robotName) {
    const robotCards = document.querySelectorAll('.robot-option-card');
    robotCards.forEach(card => {
        const isSelected = card.getAttribute('data-robot') === robotName;
        
        if (isSelected) {
            card.classList.remove('border', 'border-[#334155]');
            card.classList.add('border-2', 'border-blue-500');
            
            // 确保有选中标记
            const footerDiv = card.querySelector('.mt-4');
            if (!footerDiv.querySelector('.text-green-400')) {
                const mark = document.createElement('span');
                mark.className = 'text-green-400 flex items-center text-sm';
                mark.innerHTML = '<i class="fa fa-check-circle mr-1"></i> 已选择';
                footerDiv.appendChild(mark);
            }
        } else {
            card.classList.remove('border-2', 'border-blue-500');
            card.classList.add('border', 'border-[#334155]');
            
            // 移除选中标记
            const selectedMark = card.querySelector('.text-green-400');
            if (selectedMark) {
                selectedMark.remove();
            }
        }
    });
}

// 更新首页的项目选择状态
function updateHomePageProjectSelection(projectName) {
    const projectCards = document.querySelectorAll('.project-option-card');
    projectCards.forEach(card => {
        const isSelected = card.getAttribute('data-project') === projectName;
        
        if (isSelected) {
            card.classList.remove('border', 'border-[#334155]');
            card.classList.add('border-2', 'border-blue-500');
        } else {
            card.classList.remove('border-2', 'border-blue-500');
            card.classList.add('border', 'border-[#334155]');
        }
    });
}

// 更新当前项目信息
function updateCurrentProjectInfo() {
    const projectNameElement = document.getElementById('current-project-name');
    const projectDescElement = document.getElementById('current-project-desc');
    
    if (projectNameElement && projectDescElement) {
        projectNameElement.textContent = selectedProject;
        
        // 根据项目名称设置描述
        let description = '';
        switch (selectedProject) {
            case '正方形路径挑战':
                description = '让机器人按照正方形路径移动，每完成一个边就播放提示音。';
                break;
            case '障碍物绕行':
                description = '使用传感器检测障碍物并自动绕行。';
                break;
            case '音乐播放器':
                description = '让机器人播放简单的音乐曲目。';
break;
            default:
                description = '选择的项目描述。';
        }
        
        projectDescElement.textContent = description;
    }
}

// 初始化Blockly工作区
function initBlockly() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    
    // 使用内置的toolbox XML
    workspace = Blockly.inject(blocklyDiv, {
        collapse: true,
        comments: true,
        disable: false,
maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: 'start',
        toolbox: document.getElementById('toolbox'),
        css: true,
        // 修改media路径为正确的相对路径
        media: 'lib/node_modules/blockly/media/',
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
        grid: {
            spacing: 40,
            length: 2,
            colour: '#334155',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        }
    });
    
    // 添加对Blockly事件的监听，处理工具箱状态变化
    workspace.addChangeListener(function(event) {
        // 监听工具箱打开/关闭事件
        if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
            // 工具箱项目被选中时的处理
            setTimeout(function() {
                // 确保DOM已更新
                const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
                if (toolboxDiv) {
                    // 重置滚动条状态
                    toolboxDiv.style.overflowY = 'auto';
                }
            }, 100);
        }
    });
    
    // 添加鼠标点击事件监听器，当点击工作区时确保工具箱滚动条正确重置
    blocklyDiv.addEventListener('click', function(e) {
        // 检查点击目标是否不是工具箱或其内容
        const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
        if (toolboxDiv && !toolboxDiv.contains(e.target)) {
            // 重置工具箱滚动行为
            setTimeout(function() {
                // 强制重绘
                toolboxDiv.style.display = 'none';
                toolboxDiv.offsetHeight; // 触发重排
                toolboxDiv.style.display = 'block';
            }, 50);
        }
    });
    
    log('🔧 Blockly工作区初始化完成');
    
    // 初始化按钮事件
    initButtonEvents();
}

    // 在initButtonEvents函数中添加生成代码按钮事件
    function initButtonEvents() {
        // 现有的按钮事件...
        
        // 生成代码按钮事件
        const generateCodeBtn = document.getElementById('generate-code-btn');
        if (generateCodeBtn) {
            generateCodeBtn.addEventListener('click', function() {
                const code = generateCode();
                const codeDisplay = document.getElementById('generated-code');
                const codeModal = document.getElementById('code-modal');
                
                if (codeDisplay && codeModal) {
                    codeDisplay.textContent = code;
                    codeModal.classList.remove('hidden');
                    log('📝 生成代码并显示');
                }
            });
        }
        
        // 关闭模态框按钮事件
        const closeModalBtn = document.getElementById('close-modal-btn');
        const closeCodeBtn = document.getElementById('close-code-btn');
        const codeModal = document.getElementById('code-modal');
        
        if (closeModalBtn && codeModal) {
            closeModalBtn.addEventListener('click', function() {
                codeModal.classList.add('hidden');
            });
        }
        
        if (closeCodeBtn && codeModal) {
            closeCodeBtn.addEventListener('click', function() {
                codeModal.classList.add('hidden');
            });
        }
        
        // 复制代码按钮事件
        const copyCodeBtn = document.getElementById('copy-code-btn');
        if (copyCodeBtn) {
            copyCodeBtn.addEventListener('click', function() {
                const code = document.getElementById('generated-code').textContent;
                navigator.clipboard.writeText(code).then(function() {
                    log('📋 代码已复制到剪贴板');
                }).catch(function(err) {
                    log('❌ 复制失败: ' + err);
                });
            });
        }
    }
    
    // 改进日志函数，添加样式和时间戳
    function log(message) {
        const logElement = document.getElementById('logText');
        if (logElement) {
            const timestamp = new Date().toLocaleTimeString();
            // 根据消息类型添加不同的样式标记
            let styledMessage = message;
            
            // 为不同类型的日志添加不同的颜色标记
            if (message.startsWith('🔧') || message.startsWith('📋') || message.startsWith('📝')) {
                styledMessage = `<span class="text-blue-400">${message}</span>`;
            } else if (message.startsWith('❌')) {
                styledMessage = `<span class="text-red-400">${message}</span>`;
            } else if (message.startsWith('✅') || message.startsWith('📚') || message.startsWith('🎯')) {
                styledMessage = `<span class="text-green-400">${message}</span>`;
            }
            
            logElement.value += `[${timestamp}] ${message}\n`;
            logElement.scrollTop = logElement.scrollHeight; // 自动滚动到底部
        }
    }
    
    // 初始化模块拖拽功能
    function initModuleDragAndDrop() {
        const toolboxBlocks = document.querySelectorAll('.toolbox-block');
        
        toolboxBlocks.forEach(block => {
            // 设置拖拽功能
            block.setAttribute('draggable', 'true');
            block.addEventListener('dragstart', function(e) {
                const blockType = this.getAttribute('data-type');
                const blockValues = this.getAttribute('data-value');
                e.dataTransfer.setData('blockType', blockType);
                e.dataTransfer.setData('blockValues', blockValues || '');
            });
        });
        
        // 设置工作区为放置目标
        const blocklyDiv = document.getElementById('blocklyDiv');
        blocklyDiv.addEventListener('dragover', function(e) {
            e.preventDefault(); // 允许放置
        });
        
        // 处理放置事件
        blocklyDiv.addEventListener('drop', function(e) {
            e.preventDefault();
            
            const blockType = e.dataTransfer.getData('blockType');
            const blockValues = e.dataTransfer.getData('blockValues');
            
            if (blockType) {
                try {
                    // 创建新块
                    const block = workspace.newBlock(blockType);
                    
                    // 设置块的值（如果有）
                    if (blockValues) {
                        const values = blockValues.split(',');
                        values.forEach(value => {
                            const [key, val] = value.split(':');
                            
                            // 尝试直接设置字段值
                            try {
                                block.setFieldValue(val, key);
                            } catch (err) {
                                // 如果失败，尝试创建输入连接
                                if (block.inputList && block.inputList.length > 0) {
                                    for (let i = 0; i < block.inputList.length; i++) {
                                        const input = block.inputList[i];
                                        if (input.type === Blockly.INPUT_VALUE && input.connection) {
                                            const numberBlock = workspace.newBlock('math_number');
                                            numberBlock.setFieldValue(val, 'NUM');
                                            numberBlock.initSvg();
                                            numberBlock.render();
                                            block.getInput(input.name).connection.connect(numberBlock.outputConnection);
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                    
                    // 初始化块
                    block.initSvg();
                    block.render();
                    
                    // 设置块的位置
                    const rect = blocklyDiv.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    block.moveBy(x, y);
                    
                    // 选中块
                    workspace.clearSelection();
                    block.select();
                    
                    // 修复日志输出
                    log(`✅ 添加了【${blockType}】模块`);
                    
                    // 更新模块属性面板
                    updateBlockProperties(block);
                } catch (err) {
                    // 错误处理
                    log(`❌ 添加模块失败: ${err.message}`);
                    console.error('添加模块时出错:', err);
                }
            }
        });
    }
    
    // 初始化模块分类切换
    function initModuleItems() {
        const moduleItems = document.querySelectorAll('.module-item');
        moduleItems.forEach(item => {
            item.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // 切换内容显示
                const content = document.querySelector(`.module-content[data-category="${category}"]`);
                if (content) {
                    // 如果内容已显示，则隐藏它
                    if (content.classList.contains('show')) {
                        content.classList.remove('show');
                        this.querySelector('.fa-caret-down').classList.replace('fa-caret-down', 'fa-caret-right');
                    } else {
                        // 否则先隐藏所有内容，再显示当前内容
                        document.querySelectorAll('.module-content').forEach(c => {
                            c.classList.remove('show');
                            document.querySelector(`.module-item[data-category="${c.getAttribute('data-category')}"] .fa-caret-down`)
                              ?.classList.replace('fa-caret-down', 'fa-caret-right');
                        });
                        content.classList.add('show');
                        this.querySelector('.fa-caret-right')?.classList.replace('fa-caret-right', 'fa-caret-down');
                    }
                }
            });
        });
    }
    
    // 更新模块属性面板
    function updateBlockProperties(block) {
        const propertiesDiv = document.getElementById('block-properties');
        
        if (!block) {
            propertiesDiv.innerHTML = '<p class="text-gray-400">选择一个模块查看属性</p>';
            return;
        }
        
        let html = '';
        
        // 添加块的基本信息
        html += `
            <div class="p-2 bg-[#334155] rounded-lg mb-2">
                <h4 class="font-medium">${block.type}</h4>
            </div>
        `;
        
        // 添加字段属性
        if (block.inputList && block.inputList.length > 0) {
            html += '<div class="space-y-2">';
            block.inputList.forEach(input => {
                if (input.type === Blockly.INPUT_VALUE) {
                    html += `
                        <div class="flex justify-between items-center">
                            <span>${input.name}</span>
                            <input type="number" class="w-20 p-1 bg-[#334155] border border-[#475569] rounded text-sm" value="100">
                        </div>
                    `;
                }
            });
            html += '</div>';
        }
        
        propertiesDiv.innerHTML = html;
    }
    
    // 初始化按钮事件
    function initButtonEvents() {
        // 运行按钮
        document.getElementById('run-btn').addEventListener('click', function() {
            log('▶️ 正在执行程序...');
            const code = generateCode();
            log('📝 生成代码:\n' + code);
            // 实际应用中，这里会执行生成的代码
        });
        
        // 停止按钮
        document.getElementById('stop-btn').addEventListener('click', function() {
            log('⏹️ 程序已停止');
        });
        
        // 单步执行按钮
        document.getElementById('step-btn').addEventListener('click', function() {
            log('🔄 单步执行...');
        });
        
        // 撤销按钮
        document.getElementById('undo-btn').addEventListener('click', function() {
            if (workspace.undo) {
                workspace.undo();
                log('↩️ 撤销操作');
            }
        });
        
        // 重做按钮
        document.getElementById('redo-btn').addEventListener('click', function() {
            if (workspace.redo) {
                workspace.redo();
                log('↪️ 重做操作');
            }
        });
        
        // 清空工作区
        document.getElementById('clear-workspace').addEventListener('click', function() {
            if (confirm('确定要清空工作区吗？')) {
                workspace.clear();
                log('🗑️ 工作区已清空');
            }
        });
        
        // 清空日志
        document.getElementById('clear-log').addEventListener('click', function() {
            const logText = document.getElementById('logText');
            logText.value = '';
            log('📜 日志已清空');
        });
        
        // 获取日志
        document.getElementById('get-log').addEventListener('click', function() {
            log('🔄 刷新日志');
        });
        
        // 监听工作区选择变化
        workspace.addChangeListener(function(event) {
            if (event.type === Blockly.Events.SELECTED) {
                updateBlockProperties(workspace.getSelected());
            }
        });
    }
    
    // 初始化日志
    function initLog() {
        log('👋 欢迎使用 AI XBot 编程平台！');
        log(`🔌 已连接到 ${selectedRobot}。`);
        log(`📁 当前项目: ${selectedProject}`);
        log('🚀 准备就绪，等待程序运行。');
    }
    
    function log(message) {
        try {
            const logText = document.getElementById('logText');
            if (logText) {
                const timestamp = new Date().toLocaleTimeString();
                logText.value += `[${timestamp}] ${message}\n`;
                logText.scrollTop = logText.scrollHeight;
            }
        } catch (err) {
            console.error('日志输出错误:', err);
        }
    }
    
    // 生成代码函数
    function generateCode() {
        return Blockly.JavaScript.workspaceToCode(workspace);
    }
    
    // 在合适位置添加生成代码模态框控制逻辑
    function initCodeModal() {
        const generateBtn = document.getElementById('generate-code-btn');
        const modal = document.getElementById('code-modal');
        const closeBtn1 = document.getElementById('close-modal-btn');
        const closeBtn2 = document.getElementById('close-code-modal-btn');
        const copyBtn = document.getElementById('copy-code-btn');
        const codeDisplay = document.getElementById('generated-code');
        
        if (generateBtn && modal && closeBtn1 && closeBtn2 && copyBtn && codeDisplay) {
            generateBtn.addEventListener('click', function() {
                const code = generateCode();
                codeDisplay.textContent = code;
                modal.classList.remove('hidden');
            });
            
            function closeModal() {
                modal.classList.add('hidden');
            }
            
            closeBtn1.addEventListener('click', closeModal);
            closeBtn2.addEventListener('click', closeModal);
            
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(codeDisplay.textContent)
                    .then(() => {
                        log('✅ 代码已复制到剪贴板');
                        alert('代码已复制到剪贴板');
                    })
                    .catch(err => {
                        log(`❌ 复制失败: ${err.message}`);
                    });
            });
            
            // 点击模态框外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    }
    
    // 确保在showPlatformPage函数中调用
    function showPlatformPage() {
        // ... 现有代码 ...
        initBlockly();
        initCodeModal(); // 添加这一行
        // ... 现有代码 ...
    }