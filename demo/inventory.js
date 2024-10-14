

export class Inventory {
    constructor(scene, camera) {
        this.items = [];
        this.scene = scene;
        this.camera = camera;
        this.isInventoryVisible = false;
        this.createInventoryButton();
        this.createModalContainer();
        this.loadInventoryTemplate();
        this.createHomeButton();
        this.isPopupOpen = false;

    }

    createInventoryButton() {
        const button = this.createGlassButton('    ', '100px', '40px'); 
        button.style.position = 'fixed';
         // 设置按钮的背景图片
        button.style.backgroundImage = 'url(UI/main/main3.png)';
        button.style.backgroundSize = 'cover';
        // 设置按钮的宽度和高度
        button.style.width = '120px';  
        button.style.height = '50px'; 
        
        // 鼠标悬停时更换背景图片
        button.onmouseover = () => {
            button.style.backgroundImage = 'url(UI/main/main4.png)';
        };
        
        // 鼠标移出时还原背景图片
        button.onmouseout = () => {
            button.style.backgroundImage = 'url(UI/main/main3.png)';
        };
        
        // 点击瞬间变暗
        button.onclick = () => {
            button.style.filter = 'brightness(0.5)';
            setTimeout(() => {
                button.style.filter = 'brightness(1)';
                this.toggleInventoryModal();
            }, 100);
        };
        
        document.body.appendChild(button);
    }
    
    createHomeButton() {
        const button = this.createGlassButton('    ', '20px', '40px');
        button.onclick = () => window.location.href = 'index.html';
        button.style.position = 'fixed';
        // 设置按钮的背景图片
       button.style.backgroundImage = 'url(UI/main/main5.png)';
       button.style.backgroundSize = 'cover';
       // 设置按钮的宽度和高度
       button.style.width = '120px';  
       button.style.height = '50px'; 
       
       // 鼠标悬停时更换背景图片
       button.onmouseover = () => {
           button.style.backgroundImage = 'url(UI/main/main6.png)';
       };
       
       // 鼠标移出时还原背景图片
       button.onmouseout = () => {
           button.style.backgroundImage = 'url(UI/main/main5.png)';
       };
       
       // 点击瞬间变暗
       button.onclick = () => {
           button.style.filter = 'brightness(0.5)';
           setTimeout(() => {
               button.style.filter = 'brightness(1)';
               this.toggleInventoryModal();
           }, 100);
       };
        document.body.appendChild(button);
    }
    
    createGlassButton(text, top, right) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.right = right;
        button.style.zIndex = '1001';
        button.style.padding = '12px 20px';
        button.style.fontSize = '18px';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        button.style.backdropFilter = 'blur(10px)';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.transition = 'all 0.3s ease';
    
        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
        };
    
        button.onmouseout = () => {
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };
    
        return button;
    }
    
    createModalContainer() {
        const modal = document.createElement('div');
        modal.id = 'inventoryModal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1000';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.overflow = 'hidden';
        modal.style.backgroundColor = 'rgba(0,0,0,0.4)';

        const modalContent = document.createElement('div');
        modalContent.id = 'inventoryModalContent';
        modalContent.style.width = '100%';
        modalContent.style.height = '100%';
        modalContent.style.overflow = 'hidden';

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    async loadInventoryTemplate() {
        try {
            const response = await fetch('bar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            const modalContent = document.getElementById('inventoryModalContent');
            modalContent.innerHTML = html;

            // 提取并应用样式
            const styleContent = modalContent.querySelector('style');
            if (styleContent) {
                const styleElement = document.createElement('style');
                styleElement.textContent = styleContent.textContent;
                document.head.appendChild(styleElement);
                styleContent.remove();
            }

            this.setupEventListeners();
            this.injectToggleInventoryFunction();
        } catch (error) {
            console.error('Error loading inventory template:', error);
        }
    }

    setupEventListeners() {
        const itemSlots = document.querySelectorAll('.item-slot');
        itemSlots.forEach((slot, index) => {
            slot.addEventListener('mouseover', () => this.showItemDescription(index + 1));
            slot.addEventListener('mouseout', () => this.resetItemDescription());
        });
    }

    injectToggleInventoryFunction() {
        // 将原有的 toggleInventory 函数注入到模态窗口的上下文中
        const script = document.createElement('script');
        script.textContent = `
            function toggleInventory() {
                var taskbar = document.querySelector('.taskbar');
                var itemBar = document.querySelector('.itemBar');
                var rightBlock = document.querySelector('.right-block');
                var img = rightBlock.querySelector('img');
                var rotatingImage = document.getElementById('rotatingImage');
                var rotatingImage2 = document.getElementById('rotatingImage2');

                if (taskbar.style.left === "-100%") {
                    // 已经移出后的恢复
                    rotatingImage.style.left = "-25%";                  
                    rotatingImage2.style.left = "-25%"
                    taskbar.style.left = "0";
                    itemBar.style.right = "-100%";
                    rightBlock.style.right = "0";
                    img.src = "UI/bar/bar7.png"; // 恢复原图
                } else {
                    // 移出移入
                    rotatingImage.style.left = "-100%";
                    rotatingImage2.style.left = "-100%";
                    taskbar.style.left = "-100%";
                    itemBar.style.right = "0";
                    rightBlock.style.right = "85%"; // 按钮移到左侧
                    img.src = "UI/bar/bar8.png"; // 更换图片
                }
            }
        `;
        document.body.appendChild(script);
    }

    toggleInventoryModal() {
        const modal = document.getElementById('inventoryModal');
        if (modal) {
            this.isInventoryVisible = !this.isInventoryVisible;
            modal.style.display = this.isInventoryVisible ? 'block' : 'none';
            
            if (this.isInventoryVisible) {
                this.updateInventoryDisplay();
            }
        }
    }
    
    updateInventoryDisplay() {
        const itemArea = document.getElementById('itemArea');
        if (!itemArea) return;
    
        // 清空现有的物品槽
        itemArea.innerHTML = '';
    
        // 创建新的物品槽
        for (let i = 0; i < 10; i++) {
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            slot.innerHTML = `<img id="slot${i + 1}" src="UI/goods/goods0.png" alt="空物品槽">`;
    
            const item = this.items[i];
            if (item) {
                const img = slot.querySelector('img');
                img.src = `UI/goods/goods${item.index}.png`;  // 使用物品的索引
                img.alt = item.name;
    
                slot.addEventListener('mouseover', () => this.showItemDescription(i + 1));
                slot.addEventListener('mouseout', () => this.resetItemDescription());
            }
    
            itemArea.appendChild(slot);
        }
    }


    showItemDescription(itemIndex) {
        const descriptionText = document.querySelector('.description-text');
        const descriptionText2 = document.querySelector('.description-text2');
        
        if (descriptionText && descriptionText2) {
            const item = this.items[itemIndex - 1];
            if (item) {
                descriptionText.innerText = item.name;
                descriptionText2.innerText = item.description;
            } else {
                descriptionText.innerText = "空物品";
                descriptionText2.innerText = "这个物品槽是空的";
            }
        }
    }

    resetItemDescription() {
        const descriptionText = document.querySelector('.description-text');
        const descriptionText2 = document.querySelector('.description-text2');
        
        if (descriptionText && descriptionText2) {
            descriptionText.innerText = "";
            descriptionText2.innerText = "";
        }
    }


    hasItem(item) {
        return this.items.some(i => i.name === item);
    }

    addItem(item, description, index) {
        console.log(`Adding item: ${item}, description: ${description}, index: ${index}`);
        this.items.push({ name: item, description: description, index: index });
        this.checkVictoryCondition(); // 每次添加物品后检查是否达到胜利条件
    }

    showCollectPopup(item, index) {
        if (this.isPopupOpen) return;
        this.isPopupOpen = true;
    
        console.log(`Showing popup for item: ${item}, index: ${index}`);
    
        const imageIndex = index !== undefined ? index : 0;
        const imageSrc = `UI/goods/goods${imageIndex}.png`;
        
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        overlay.style.zIndex = '1002';
    
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        popup.style.backdropFilter = 'blur(10px)';
        popup.style.padding = '30px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        popup.style.zIndex = '1003';
        popup.style.textAlign = 'center';
        popup.style.color = '#333';
        popup.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        popup.style.transition = 'all 0.3s ease-in-out';
        popup.style.width = '300px';
    
        popup.innerHTML = `
            <h2 style="margin: 0 0 20px; font-size: 24px; color: #1e3a8a;">恭喜发现！</h2>
            <div style="background-color: rgba(255, 255, 255, 0.5); border-radius: 50%; width: 120px; height: 120px; margin: 0 auto 20px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <img src="${imageSrc}" alt="${item}" style="width: 80%; height: 80%; object-fit: contain;">
            </div>
            <p style="font-size: 18px; margin-bottom: 20px;">你收集到了 <span style="font-weight: bold; color: #2c5282;">${item}</span></p>
            <div id="closeButton" style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.8); color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; opacity: 0; transition: opacity 0.3s ease;">
                <span style="position: relative; display: inline-block; width: 20px; height: 20px;">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 16px; height: 2px; background-color: white;"></span>
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); width: 16px; height: 2px; background-color: white;"></span>
                </span>
                <span id="closeHint" style="position: absolute; top: 100%; right: 0; background-color: rgba(59, 130, 246, 0.8); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; opacity: 0; transition: opacity 0.3s ease;">点击关闭</span>
            </div>
        `;
    
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    
        const closeButton = popup.querySelector('#closeButton');
        const closeHint = popup.querySelector('#closeHint');
    
        // 鼠标悬浮在弹窗上时显示关闭按钮
        popup.onmouseover = () => {
            closeButton.style.opacity = '1';
        };
        popup.onmouseout = () => {
            closeButton.style.opacity = '0';
            closeHint.style.opacity = '0';
        };
    
        // 鼠标悬浮在关闭按钮上时显示提示
        closeButton.onmouseover = () => {
            closeHint.style.opacity = '1';
        };
        closeButton.onmouseout = () => {
            closeHint.style.opacity = '0';
        };
    
        // 点击关闭弹窗
        const closePopup = () => {
            document.body.removeChild(overlay);
            this.isPopupOpen = false;
            this.lastPopupCloseTime = Date.now();
        };
    
        closeButton.onclick = (event) => {
            event.stopPropagation();
            closePopup();
        };
    
        overlay.onclick = (event) => {
            if (event.target === overlay) {
                event.stopPropagation();
                closePopup();
            }
        };
    
        // 添加动画效果
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
            popup.offsetHeight; // 触发重绘
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 0);
    }

    checkVictoryCondition() {
        const requiredIndexes = [1, 2,3,4,5,6]; // 胜利所需的物品索引
        const collectedIndexes = this.items.map(item => item.index);
        
        const isVictory = requiredIndexes.every(index => collectedIndexes.includes(index));
        
        if (isVictory) {
            this.showVictoryPopup();
        }
    }
    
    showVictoryPopup() {
        if (this.isPopupOpen) return;
        this.isPopupOpen = true;
    
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        overlay.style.zIndex = '1002';
    
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        popup.style.backdropFilter = 'blur(10px)';
        popup.style.padding = '30px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        popup.style.zIndex = '1003';
        popup.style.textAlign = 'center';
        popup.style.color = '#333';
        popup.style.fontFamily = 'Segoe UI, Arial, sans-serif';
        popup.style.transition = 'all 0.3s ease-in-out';
        popup.style.width = '300px';
    
        popup.innerHTML = `
            <h2 style="margin: 0 0 20px; font-size: 24px; color: #1e3a8a;">恭喜胜利！</h2>
            <p style="font-size: 18px; margin-bottom: 20px;">你已经收集到了所有需要的物品，成功完成了游戏！</p>
            <div id="closeButton" style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.8); color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; opacity: 0; transition: opacity 0.3s ease;">
                <span style="position: relative; display: inline-block; width: 20px; height: 20px;">
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 16px; height: 2px; background-color: white;"></span>
                    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); width: 16px; height: 2px; background-color: white;"></span>
                </span>
                <span id="closeHint" style="position: absolute; top: 100%; right: 0; background-color: rgba(59, 130, 246, 0.8); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; white-space: nowrap; opacity: 0; transition: opacity 0.3s ease;">点击关闭</span>
            </div>
        `;
    
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    
        const closeButton = popup.querySelector('#closeButton');
        const closeHint = popup.querySelector('#closeHint');
    
        // 鼠标悬浮在弹窗上时显示关闭按钮
        popup.onmouseover = () => {
            closeButton.style.opacity = '1';
        };
        popup.onmouseout = () => {
            closeButton.style.opacity = '0';
            closeHint.style.opacity = '0';
        };
    
        // 鼠标悬浮在关闭按钮上时显示提示
        closeButton.onmouseover = () => {
            closeHint.style.opacity = '1';
        };
        closeButton.onmouseout = () => {
            closeHint.style.opacity = '0';
        };
    
        // 点击关闭弹窗
        const closePopup = () => {
            document.body.removeChild(overlay);
            this.isPopupOpen = false;
 
        };
    
    
        closeButton.onclick = closePopup;
    
        // 添加动画效果
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
            popup.offsetHeight; // 触发重绘
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 0);
;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1003';
        popup.innerHTML = `
            <h2>恭喜！</h2>
            <p>你收集到了 ${item}！</p>
            <button onclick="this.parentElement.remove()">关闭</button>
        `;
        document.body.appendChild(popup);
;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1003';
        popup.innerHTML = `
            <h2>恭喜！</h2>
            <p>你收集到了 ${item}！</p>
            <button onclick="this.parentElement.remove()">关闭</button>
        `;
        document.body.appendChild(popup);
;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1003';
        popup.innerHTML = `
            <h2>恭喜！</h2>
            <p>你收集到了 ${item}！</p>
            <button onclick="this.parentElement.remove()">关闭</button>
        `;
        document.body.appendChild(popup);
;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1003';
        popup.innerHTML = `
            <h2>恭喜！</h2>
            <p>你收集到了 ${item}！</p>
            <button onclick="this.parentElement.remove()">关闭</button>
        `;
        document.body.appendChild(popup);
;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '1003';
        popup.innerHTML = `
            <h2>恭喜！</h2>
            <p>你收集到了 ${item}！</p>
            <button onclick="this.parentElement.remove()">关闭</button>
        `;
        document.body.appendChild(popup);
    }
}
