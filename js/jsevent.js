
//创建li
function creatLi(uuid, value, checked) {
	//创建li对象，并添加
	var li = document.createElement('li');
	
	li.id = uuid;
	
	var checkedString = '';
	var styleString = '';
	if (checked == true) {
		checkedString = 'checked';
		styleString = 'text-decoration:line-through';
	}
	
	li.innerHTML = '<div class="view"><input type="checkbox" class="toggle" onclick="clickChecked(this)" '+checkedString+'>'
		+'<label ondblclick="dblclickInfo(this)" style="'+ styleString +'">'+ value +'</label>'
		+'<button type="button" class="delete" onclick="deleteLi(this)"></button></div>'
		+'<input class="layui-input" type="text" value="" onkeydown="editInfo(this)" onblur="hideInput(this)" autocomplete="off" style="display: none;width: 100%;">';
	
	document.getElementById('list').appendChild(li);
}

//输入框回车，添加li
function addLi() {
	if (event.keyCode == 13) {
		//回车事件
		var addInfo = document.getElementById('addInfo').value;
		
		//过滤左右空格
		addInfo = addInfo.replace(/(^\s*)|(\s*$)/g, "");
		//addInfo = addInfo.replace(/\s/g,'');
		if (addInfo != '') {
			//从localStorage获取data
			var data = JSON.parse(window.localStorage.getItem('data'));
			if (data == null || data == '') {
				//若localStorage没有存储data
				data = [];
			}
			
			//添加新增的数据到data
			var obj = {};
			obj.uuid = UUID();
			obj.value = addInfo;
			obj.checked = false;
			data.push(obj)
			//将data重新存放到localStorage
			window.localStorage.setItem('data',JSON.stringify(data));
			
			//创建li对象，并添加
			creatLi(obj.uuid, obj.value, obj.checked);
			
			//输入框清空值
			document.getElementById('addInfo').value = '';
		}
		
		//根据显示状态，重新生成list
		var showType = document.getElementById('showType').value;
 		reloadList(showType);
 	
		//计算item left
		getItemLeft();
	}
}

//生成uuid
function UUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//计算item left
function getItemLeft() {
	var itemLeft =0;
	//从localStorage获取data，并根据data计算item left
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].checked == false) {
				itemLeft = itemLeft + 1;
			}
		}
	}
	
	//赋值
	document.getElementById('itemLeft').innerHTML = itemLeft;
	
	//判断Clear completed按钮是否显示。只要有一个已选中就显示，否则不显示
	handdenClearCompleted();
}

//根据显示状态，重新生成list
function reloadList(value) {
	if (value == 'all' || value == '') {
		//记录当前选中类型
		document.getElementById('showType').value = value;
		
		//删除所有li
		document.getElementById('list').innerHTML = '';
		
		//从localStorage获取data，并根据data重新生成list
		var data = JSON.parse(window.localStorage.getItem('data'));
		if (data != null && data != '') {
			for (var i=0;i<data.length;i++) {
				//创建li对象，并添加
			  	creatLi(data[i].uuid, data[i].value, data[i].checked);
			}
		}
		
		//点击三个状态时，改变选中状态
		document.getElementById('all').className = 'enda endselected';
		document.getElementById('active').className = 'enda';
		document.getElementById('completed').className = 'enda';
	} else if (value == 'active') {
		//记录当前选中类型
		document.getElementById('showType').value = value;
		
		//删除所有li
		document.getElementById('list').innerHTML = '';
		
		//从localStorage获取data，并根据data重新生成list
		var data = JSON.parse(window.localStorage.getItem('data'));
		if (data != null && data != '') {
			for (var i=0;i<data.length;i++) {
				if (data[i].checked == false) {
					//创建li对象，并添加
			  		creatLi(data[i].uuid, data[i].value, false);
				}
			}
		}
		
		//点击三个状态时，改变选中状态
		document.getElementById('all').className = 'enda';
		document.getElementById('active').className = 'enda endselected';
		document.getElementById('completed').className = 'enda';
	} else if (value == 'completed') {
		//记录当前选中类型
		document.getElementById('showType').value = value;
		
		//删除所有li
		document.getElementById('list').innerHTML = '';
		
		//从localStorage获取data，并根据data重新生成list
		var data = JSON.parse(window.localStorage.getItem('data'));
		if (data != null && data != '') {
			for (var i=0;i<data.length;i++) {
				if (data[i].checked == true) {
					//创建li对象，并添加
			  		creatLi(data[i].uuid, data[i].value, true);
				}
			}
		}
		
		//点击三个状态时，改变选中状态
		document.getElementById('all').className = 'enda';
		document.getElementById('active').className = 'enda';
		document.getElementById('completed').className = 'enda endselected';
	}
}

//点击复选框
function clickChecked(obj) {
	var id = obj.parentNode.parentNode.id;
	
	//从localStorage获取data，并改变这个选项的checked
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].uuid == id) {
				data[i].checked = obj.checked;
			}
		}
	}
	
	//将data重新存放到localStorage
	window.localStorage.setItem('data',JSON.stringify(data));
	
	//根据显示状态，重新生成list
	var showType = document.getElementById('showType').value;
 	reloadList(showType);
 	
	//计算item left
	getItemLeft();
}

//点击删除按钮
function deleteLi(obj) {
	var id = obj.parentNode.parentNode.id;
	
	//从localStorage获取data，并从data中删除这个选项
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].uuid == id) {
				data.splice(i,1);
				break;
			}
		}
	}
	
	//将data重新存放到localStorage
	window.localStorage.setItem('data',JSON.stringify(data));
	
	//删除页面上的该选项对应的节点
	obj.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode);
	
	//根据显示状态，重新生成list
	var showType = document.getElementById('showType').value;
 	reloadList(showType);
 	
	//计算item left
	getItemLeft();
}

//双击，弹出选项修改输入框
function dblclickInfo(obj) {
	//隐藏选项
	obj.parentNode.style.display = 'none';
	
	//显示输入框，获取值，聚焦
	var text = obj.innerText;
	obj.parentNode.nextSibling.value = text;
	obj.parentNode.nextSibling.style.display = '';
	obj.parentNode.nextSibling.focus(); 
}

//选项输入框，按Esc或失去光标后，把当前输入框隐藏
function hideInput(obj) {
	//隐藏输入框
	obj.style.display = 'none';
	obj.value = '';
	
	//显示选项
	obj.previousSibling.style = '';
}

//选项修改输入框，回车事件
function editInfo(obj) {
	if (event.keyCode == 27) {
		//按Esc后，隐藏选项修改输入框
		hideInput(obj);
	} else if (event.keyCode == 13) {
		//按回车，修改值
		var value = obj.value;
		
		//过滤左右空格
		value = value.replace(/(^\s*)|(\s*$)/g, "");
		if (value != '') {
			//修改data里对应的值
			var uuid = obj.parentNode.id;
			//从localStorage获取data，并从data中删除这个选项
			var data = JSON.parse(window.localStorage.getItem('data'));
			if (data != null && data != '') {
				for (var i=0;i<data.length;i++) {
					if (data[i].uuid == uuid) {
						data[i].value = value;
					}
				}
			}
			//将data重新存放到localStorage
			window.localStorage.setItem('data',JSON.stringify(data));
			
			//修改labei的值
			obj.previousSibling.childNodes[1].innerHTML = value;
			
			//修改完成后，隐藏输入框
			hideInput(obj);
		}
	}
}

//清除已完成事件
function clearCompleted() {
	//从localStorage获取data，并根据data，删除checked为true的数据
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].checked == true) {
				data.splice(i,1);
				//data数组通过splice删除后，会少一条数据，下标会减一，数组下标发生变化，所以重新从0开始检索
				i = -1;
			}
		}
	}
	
	//将data重新存放到localStorage
	window.localStorage.setItem('data',JSON.stringify(data));
	
	//根据显示状态，重新生成list
	var showType = document.getElementById('showType').value;
 	reloadList(showType);
 	
 	//判断Clear completed按钮是否显示。只要有一个已选中就显示，否则不显示
	handdenClearCompleted();
}

//检查所有选项的选中情况，全部选中返回true,否则返回false
function checkStatus() {
	var status = true;
	
	//从localStorage获取data，并根据data，判断是否所有选项都为true
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].checked == false) {
				status= false;
				break;
			}
		}
	}
	
	return status;
}

//选中所有复选框
function selectAll(obj) {
	//从localStorage获取data，并改变所有选项的checked
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			data[i].checked = obj;
		}
	}
	
	//将data重新存放到localStorage
	window.localStorage.setItem('data',JSON.stringify(data));
	
	//根据显示状态，重新生成list
	var showType = document.getElementById('showType').value;
 	reloadList(showType);
 	
	//计算item left
	getItemLeft();
}

//选中向下箭头，触发事件
function checkAll() {
	if (checkStatus()) {
		//选项已全部选中
		selectAll(false);
	} else {
		//选项没有全部选中
		selectAll(true);
	}
}

//判断Clear completed按钮是否显示。只要有一个已选中就显示，否则不显示
function handdenClearCompleted() {
	var status = false;
	
	//从localStorage获取data，并根据data，判断是否有已选中的选项
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			if (data[i].checked == true) {
				status= true;
				break;
			}
		}
	}
	
	if (status) {
		//有已选中的选项，显示Clear completed按钮
		document.getElementsByClassName('clear-completed')[0].style.display = '';
	} else {
		//没有已选中的选项，不显示Clear completed按钮
		document.getElementsByClassName('clear-completed')[0].style.display = 'none';
	}
}


//页面加载
window.onload = function() {
	//页面加载时，从localStorage获取data，并根据data重新生成list
	var data = JSON.parse(window.localStorage.getItem('data'));
	if (data != null && data != '') {
		for (var i=0;i<data.length;i++) {
			//创建li对象，并添加
			creatLi(data[i].uuid, data[i].value, data[i].checked);
		}
	}
	
	//计算item left
	getItemLeft();
}
