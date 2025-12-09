// 定义小狗移动积木块
Blockly.Blocks.DogMovementModule_move = {
    init: function() {
        this.appendDummyInput()
            .appendField('小狗')
            .appendField(new Blockly.FieldDropdown([
                ['前进', '前进'],
                ['后退', '后退'],
                ['左转', '左转'],
                ['右转', '右转'],
                ['停止', '停止']
            ]), 'MOVEMENT_TYPE')
            .appendField('，步数：')
            .appendField(new Blockly.FieldTextInput('10'), 'STEP_COUNT');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('控制小狗执行不同方向的移动并设置步数');
        this.setHelpUrl('');
    }
};

// 定义小狗动作积木块
Blockly.Blocks.DogActionModule_performAction = {
    init: function () {
        this.appendDummyInput()
            .appendField('小狗执行动作')
            .appendField(new Blockly.FieldDropdown([
                ['招手', '招手'],
                ['摇摆', '摇摆'],
                ['睡觉', '睡觉'],
                ['立正', '立正']
            ]), 'ACTION_TYPE')
            .appendField('，次数：')
            .appendField(new Blockly.FieldTextInput('10'), 'TIMES');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('控制小狗执行特定动作并设置执行次数');
        this.setHelpUrl('');
    }
};