// ============================================================
//                    بيانات اللعبة
// ============================================================
const gameData = {
    currentLevel: 1,
    gold: 0,
    silver: 0,
    totalStars: 0,
    completedLevels: [],
    levels: [
        // ===== المرحلة 1 =====
        {
            id: 1,
            name: "بداية الحلم",
            tasks: [
                { type: 'collect', target: '🐔', count: 3, text: 'اجمع 3 بيضات من الدجاج', emoji: '🥚' },
                { type: 'water', target: '🌾', count: 2, text: 'اسقِ نبتتي قمح', emoji: '💧' }
            ],
            timeLimit: 120,
            rewards: { gold: 5, silver: 10 }
        },
        // ===== المرحلة 2 =====
        {
            id: 2,
            name: "الصباح الباكر",
            tasks: [
                { type: 'collect', target: '🐄', count: 2, text: 'احلب البقرتين', emoji: '🥛' },
                { type: 'collect', target: '🐔', count: 5, text: 'اجمع 5 بيضات', emoji: '🥚' }
            ],
            timeLimit: 100,
            rewards: { gold: 8, silver: 15 }
        },
        // ===== المرحلة 3 =====
        {
            id: 3,
            name: "يوم الحصاد",
            tasks: [
                { type: 'collect', target: '🌾', count: 4, text: 'احصد 4 سنابل قمح', emoji: '🌾' },
                { type: 'collect', target: '🥕', count: 3, text: 'اقطف 3 جزرات', emoji: '🥕' }
            ],
            timeLimit: 90,
            rewards: { gold: 10, silver: 20 }
        },
        // ===== المرحلة 4 =====
        {
            id: 4,
            name: "رعاية الحيوانات",
            tasks: [
                { type: 'collect', target: '🐑', count: 3, text: 'اجمع 3 كرات صوف', emoji: '🧶' },
                { type: 'collect', target: '🐄', count: 3, text: 'احلب 3 بقرات', emoji: '🥛' },
                { type: 'collect', target: '🐔', count: 4, text: 'اجمع 4 بيضات', emoji: '🥚' }
            ],
            timeLimit: 110,
            rewards: { gold: 12, silver: 25 }
        },
        // ===== المرحلة 5 =====
        {
            id: 5,
            name: "المزرعة المتكاملة",
            tasks: [
                { type: 'collect', target: '🌾', count: 5, text: 'احصد 5 سنابل قمح', emoji: '🌾' },
                { type: 'collect', target: '🍅', count: 4, text: 'اقطف 4 طماطم', emoji: '🍅' },
                { type: 'collect', target: '🐴', count: 2, text: 'اعتنِ بحصانين', emoji: '🐴' }
            ],
            timeLimit: 130,
            rewards: { gold: 15, silver: 30 }
        }
        // يمكنك إضافة باقي المراحل إلى 50 هنا
    ],
    currentTasks: [],
    taskProgress: {},
    timer: 120,
    timerInterval: null,
    isLevelComplete: false,
    soundEnabled: true,
    musicEnabled: true,
    vibrationEnabled: true
};

// ============================================================
//                    الوظائف الأساسية
// ============================================================

// بدء اللعبة
function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    loadLevel(gameData.currentLevel);
}

// تحميل مرحلة
function loadLevel(levelId) {
    const level = gameData.levels.find(l => l.id === levelId);
    
    if (!level) {
        alert('🎉 ألف مبروك! أنهيت جميع المراحل!');
        backToMenu();
        return;
    }

    // إعادة تعيين حالة المرحلة
    gameData.isLevelComplete = false;
    gameData.currentTasks = level.tasks;
    gameData.taskProgress = {};
    
    level.tasks.forEach(task => {
        gameData.taskProgress[task.target] = 0;
    });

    // تحديث الواجهة
    document.getElementById('levelNumber').textContent = levelId;
    document.getElementById('timer').textContent = level.timeLimit;
    document.getElementById('goldCoins').textContent = gameData.gold;
    document.getElementById('silverCoins').textContent = gameData.silver;

    updateTasksList();

    // بدء المؤقت
    gameData.timer = level.timeLimit;
    clearInterval(gameData.timerInterval);
    gameData.timerInterval = setInterval(updateTimer, 1000);

    // إعادة تعيين أزرار الإنهاء
    document.getElementById('endLevelBtn').style.display = 'inline-block';
    document.getElementById('endLevelBtn').textContent = '⏹️ إنهاء المرحلة';
}

// تحديث قائمة المهام
function updateTasksList() {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    gameData.currentTasks.forEach((task, index) => {
        const li = document.createElement('li');
        const progress = gameData.taskProgress[task.target] || 0;
        const isComplete = progress >= task.count;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = `${task.emoji} ${task.text}`;
        
        const progressSpan = document.createElement('span');
        progressSpan.className = 'task-progress';
        progressSpan.textContent = `${progress}/${task.count}`;
        
        li.appendChild(textSpan);
        li.appendChild(progressSpan);
        
        if (isComplete) {
            li.classList.add('completed');
        }
        
        tasksList.appendChild(li);
    });
}

// ============================================================
//                    التفاعل مع العناصر
// ============================================================

document.addEventListener('click', function(e) {
    const element = e.target;
    
    // التحقق من النقر على حيوان أو محصول
    if (element.classList.contains('animal') || element.classList.contains('crop')) {
        if (gameData.isLevelComplete) return;
        
        const target = element.textContent.trim();
        const task = gameData.currentTasks.find(t => t.target === target);
        
        if (task) {
            // زيادة التقدم
            gameData.taskProgress[target] = (gameData.taskProgress[target] || 0) + 1;
            
            // تأثير بصري
            element.style.transform = 'scale(0.8)';
            setTimeout(() => element.style.transform = 'scale(1)', 200);
            
            // اهتزاز
            if (gameData.vibrationEnabled && navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            // تحديث الواجهة
            updateTasksList();
            checkLevelComplete();
        }
    }
});

// ============================================================
//                    التحقق من إكمال المرحلة
// ============================================================

function checkLevelComplete() {
    if (gameData.isLevelComplete) return;
    
    const allComplete = gameData.currentTasks.every(task => {
        return (gameData.taskProgress[task.target] || 0) >= task.count;
    });
    
    if (allComplete) {
        gameData.isLevelComplete = true;
        clearInterval(gameData.timerInterval);
        
        // إظهار رسالة نجاح
        const level = gameData.levels.find(l => l.id === gameData.currentLevel);
        
        setTimeout(() => {
            const stars = calculateStars();
            const rewards = level.rewards;
            
            // إضافة المكافآت
            gameData.gold += rewards.gold;
            gameData.silver += rewards.silver;
            gameData.totalStars += stars;
            
            // تسجيل المرحلة كمكتملة
            if (!gameData.completedLevels.includes(gameData.currentLevel)) {
                gameData.completedLevels.push(gameData.currentLevel);
            }
            
            // حفظ التقدم
            saveProgress();
            
            // عرض النتائج
            showResults(stars, rewards);
        }, 500);
    }
}

// حساب النجوم
function calculateStars() {
    const level = gameData.levels.find(l => l.id === gameData.currentLevel);
    const timeUsed = level.timeLimit - gameData.timer;
    const totalTasks = gameData.currentTasks.length;
    let completedTasks = 0;
    
    gameData.currentTasks.forEach(task => {
        if ((gameData.taskProgress[task.target] || 0) >= task.count) completedTasks++;
    });
    
    const ratio = completedTasks / totalTasks;
    
    // 3 نجوم: كل المهام مكتملة في أقل من 30% من الوقت
    if (ratio === 1 && timeUsed < level.timeLimit * 0.3) return 3;
    // نجمتان: 70% من المهام مكتملة
    if (ratio >= 0.7) return 2;
    // نجمة واحدة: الباقي
    return 1;
}

// عرض النتائج
function showResults(stars, rewards) {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    
    const starString = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('resultStars').textContent = starString;
    document.getElementById('resultGold').textContent = rewards.gold;
    document.getElementById('resultSilver').textContent = rewards.silver;
}

// ============================================================
//                    المؤقت
// ============================================================

function updateTimer() {
    gameData.timer--;
    document.getElementById('timer').textContent = gameData.timer;
    
    // تحذير عند الوقت المتبقي 10 ثوانٍ
    if (gameData.timer <= 10) {
        document.getElementById('timer').style.color = '#dc3545';
    }
    
    if (gameData.timer <= 0) {
        clearInterval(gameData.timerInterval);
        alert('⏰ انتهى الوقت! حاول مرة أخرى.');
        loadLevel(gameData.currentLevel);
    }
}

// ============================================================
//                    أزرار التحكم
// ============================================================

// إنهاء المرحلة يدوياً
function endLevel() {
    if (gameData.isLevelComplete) return;
    
    if (confirm('⚠️ هل أنت متأكد من إنهاء المرحلة الآن؟' +
                '\nسيتم احتساب ما أنجزته فقط.')) {
        clearInterval(gameData.timerInterval);
        
        const level = gameData.levels.find(l => l.id === gameData.currentLevel);
        const stars = calculateStars();
        
        // حساب المكافآت بناءً على الإنجاز
        let rewards = { gold: 0, silver: 0 };
        if (stars > 0) {
            rewards.gold = Math.floor(level.rewards.gold * (stars / 3));
            rewards.silver = Math.floor(level.rewards.silver * (stars / 3));
            
            gameData.gold += rewards.gold;
            gameData.silver += rewards.silver;
            gameData.totalStars += stars;
            
            if (!gameData.completedLevels.includes(gameData.currentLevel)) {
                gameData.completedLevels.push(gameData.currentLevel);
            }
            
            saveProgress();
            showResults(stars, rewards);
        } else {
            alert('😅 لم تحقق أي نجمة! حاول مرة أخرى.');
            loadLevel(gameData.currentLevel);
        }
    }
}

// إعادة المحاولة
function resetLevel() {
    if (confirm('🔄 هل تريد إعادة المحاولة من البداية؟')) {
        clearInterval(gameData.timerInterval);
        loadLevel(gameData.currentLevel);
    }
}

// الانتقال للمرحلة التالية
function nextLevel() {
    gameData.currentLevel++;
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    loadLevel(gameData.currentLevel);
}

// العودة للقائمة الرئيسية
function backToMenu() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('shopScreen').style.display = 'none';
    document.getElementById('settingsScreen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
    clearInterval(gameData.timerInterval);
}

// ============================================================
//                    المتجر
// ============================================================

function showShop() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('shopScreen').style.display = 'block';
}

function buyItem(item, price) {
    let currency = 'gold';
    let currencyName = '🪙 ذهبية';
    
    if (price <= gameData.gold) {
        gameData.gold -= price;
        alert(`✅ تم شراء ${item} بنجاح!`);
    } else if (price <= gameData.silver) {
        gameData.silver -= price;
        currency = 'silver';
        currencyName = '🔘 فضية';
        alert(`✅ تم شراء ${item} بنجاح!`);
    } else {
        alert(`❌ ليس لديك ما يكفي من ${currencyName}!`);
        return;
    }
    
    saveProgress();
    document.getElementById('goldCoins').textContent = gameData.gold;
    document.getElementById('silverCoins').textContent = gameData.silver;
}

// ============================================================
//                    الإعدادات
// ============================================================

function showSettings() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('settingsScreen').style.display = 'block';
    
    document.getElementById('soundToggle').checked = gameData.soundEnabled;
    document.getElementById('musicToggle').checked = gameData.musicEnabled;
    document.getElementById('vibrationToggle').checked = gameData.vibrationEnabled;
}

// حفظ الإعدادات عند التغيير
document.addEventListener('change', function(e) {
    if (e.target.id === 'soundToggle') {
        gameData.soundEnabled = e.target.checked;
    }
    if (e.target.id === 'musicToggle') {
        gameData.musicEnabled = e.target.checked;
    }
    if (e.target.id === 'vibrationToggle') {
        gameData.vibrationEnabled = e.target.checked;
    }
});

// حذف التقدم
function resetProgress() {
    if (confirm('⚠️ هل أنت متأكد من حذف كل التقدم؟' +
                '\nهذا الإجراء لا يمكن التراجع عنه!')) {
        if (confirm('🔄 تأكيد نهائي: ح
