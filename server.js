var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); //去掉“node cli_tasks.js”，只留下参数
var command = args.shift();  //取出第一个参数（命令）；
var taskDescription = args.join(' ');  //合并剩余的参数
var file = path.join(process.cwd(), '/.tasks');  //根据当前的工作目录解析数据库的相对路径

switch (command) {
    case 'list':  // list会列出所有已保存的任务
        listTasks(file);
        break;
    case 'add':  //add会添加新任务
        addTask(file, taskDescription);
        break;
    default:  //其他任何参数都会显示帮助
        console.log('Usage: ' + process.argv[0]
            + ' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb) {
    fs.access(file, function(error) {  //检查 .tasks文件是否已经存在
        var tasks = [];
        if (error) {
            cb([]);  //如果 .tasks文件不存在，则创建空的任务数组
        } else {
            fs.readFile(file, 'utf8', function(err, data) {  //从.tasks文件中读取待办事项数据；
                if (err) throw err;
                var data = data.toString();
                tasks = JSON.parse(data || '[]');  //把用JSON编码的待办事项数据解析到任务数组中
                cb(tasks);
            });
        }
    });
}

function listTasks(file) {
    loadOrInitializeTaskArray(file, function(tasks) {
        for(var i in tasks) {
            console.log(tasks[i]);
        }
    });
}

function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
        if (err) throw err;
        console.log('Saved.');
    });
}

function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function(tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}