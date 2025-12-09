// 添加在文件末尾
// 定义小狗移动JavaScript生成器
Blockly.JavaScript.forBlock.DogMovementModule_move = function() {
    var movementType = this.getFieldValue('MOVEMENT_TYPE');
    var stepCount = this.getFieldValue('STEP_COUNT');
    var code = '';

    // 根据移动类型生成不同的命令
    if (movementType === '前进') {
        code = `dog_forward(${stepCount});\n`;
    } else if (movementType === '后退') {
        code = `dog_backward(${stepCount});\n`;
    } else if (movementType === '左转') {
        code = `dog_turn_left(${stepCount});\n`;
    } else if (movementType === '右转') {
        code = `dog_turn_right(${stepCount});\n`;
    } else if (movementType === '停止') {
        code = `dog_stop();\n`;
    }

    return code;
};

// 定义小狗动作JavaScript生成器
Blockly.JavaScript.forBlock.DogActionModule_performAction = function() {
    var actionType = this.getFieldValue('ACTION_TYPE');
    var times = this.getFieldValue('TIMES');
    var code = '';

    if (actionType === '招手') {
        code = `dog_sway(${times});\n`;
    } else if (actionType === '摇摆') {
        code = `dog_wave(${times});\n`;
    } else if (actionType === '睡觉') {
        code = `dog_sleep();\n`;
    } else if (actionType === '立正') {
        code = `dog_stop();\n`;
    }

    return code;
};