"use strict";
// ============================================================
//  AI机器人·成长营 — 48课时互动模拟实验引擎
//  每节课一个交互式HTML模拟小程序
// ============================================================

const Simulations = (function() {
    'use strict';

    // ---------- 工具函数 ----------
    function wrap(title, html, extraCss) {
        return `
        <div class="sim-container">
            <style>
                .sim-container { font-family: system-ui, -apple-system, sans-serif; }
                .sim-header { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
                .sim-header h3 { font-size:18px; font-weight:700; color:#1a2a6c; margin:0; font-family:'Noto Serif SC',serif; }
                .sim-badge { background:#e8f0fe; color:#1a2a6c; padding:2px 12px; border-radius:20px; font-size:12px; font-weight:600; }
                .sim-frame { background:#fff; border-radius:16px; border:2px solid #e8e0d5; overflow:hidden; }
                .sim-canvas { position:relative; background:#faf8f4; min-height:320px; padding:20px; }
                .sim-controls { background:#f0ede4; padding:12px 20px; display:flex; gap:10px; flex-wrap:wrap; align-items:center; border-top:1px solid #e8e0d5; }
                .sim-btn { padding:8px 20px; border-radius:30px; border:none; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; }
                .sim-btn-primary { background:#1a2a6c; color:#fff; }
                .sim-btn-primary:hover { background:#2d4a8e; transform:translateY(-1px); }
                .sim-btn-success { background:#5cb85c; color:#fff; }
                .sim-btn-success:hover { background:#4a9a4a; transform:translateY(-1px); }
                .sim-btn-warning { background:#e67e22; color:#fff; }
                .sim-btn-warning:hover { background:#d4701a; transform:translateY(-1px); }
                .sim-btn-danger { background:#e74c3c; color:#fff; }
                .sim-btn-danger:hover { background:#c0392b; transform:translateY(-1px); }
                .sim-btn-outline { background:transparent; border:2px solid #1a2a6c; color:#1a2a6c; }
                .sim-btn-outline:hover { background:#1a2a6c; color:#fff; }
                .sim-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
                .sim-label { font-size:13px; font-weight:600; color:#4a3a2a; }
                .sim-value { font-size:20px; font-weight:800; color:#1a2a6c; font-family:'Cormorant Garamond',serif; }
                .sim-slider { width:140px; accent-color:#1a2a6c; }
                .sim-status { padding:8px 16px; border-radius:10px; font-size:13px; font-weight:500; }
                .sim-status-info { background:#e8f0fe; color:#1a5276; }
                .sim-status-success { background:#d5f5e3; color:#1a6e3a; }
                .sim-status-warning { background:#fdebd0; color:#a04000; }
                .sim-status-error { background:#fadbd8; color:#922b21; }
                .sim-progress { height:8px; background:#e8e0d5; border-radius:10px; overflow:hidden; flex:1; min-width:100px; }
                .sim-progress-bar { height:100%; background:linear-gradient(90deg,#4a90d9,#1a2a6c); border-radius:10px; transition:width .5s; }
                .sim-grid { display:grid; gap:12px; }
                .sim-grid-2 { grid-template-columns:1fr 1fr; }
                .sim-grid-3 { grid-template-columns:1fr 1fr 1fr; }
                .sim-grid-4 { grid-template-columns:1fr 1fr 1fr 1fr; }
                .sim-card { background:#fff; border-radius:12px; padding:16px; border:1px solid #e8e0d5; text-align:center; cursor:pointer; transition:all .2s; }
                .sim-card:hover { border-color:#4a90d9; transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.08); }
                .sim-card.selected { border-color:#1a2a6c; background:#e8f0fe; }
                .sim-card-icon { font-size:36px; margin-bottom:6px; }
                .sim-card-label { font-size:13px; font-weight:600; color:#4a3a2a; }
                .sim-robot { display:flex; align-items:center; justify-content:center; gap:8px; }
                .sim-robot-body { width:80px; height:60px; background:#4a90d9; border-radius:12px; position:relative; transition:all .3s; }
                .sim-robot-wheel { width:20px; height:12px; background:#333; border-radius:4px; position:absolute; bottom:-6px; transition:all .3s; }
                .sim-robot-wheel-left { left:8px; }
                .sim-robot-wheel-right { right:8px; }
                .sim-robot-eye { width:12px; height:12px; background:#fff; border-radius:50%; position:absolute; top:12px; }
                .sim-robot-eye-left { left:18px; }
                .sim-robot-eye-right { right:18px; }
                .sim-robot-eye.pupil::after { content:''; display:block; width:6px; height:6px; background:#1a2a6c; border-radius:50%; margin:3px auto; }
                .sim-legend { display:flex; gap:16px; flex-wrap:wrap; font-size:12px; color:#7a6a5a; }
                .sim-legend-item { display:flex; align-items:center; gap:4px; }
                .sim-legend-dot { width:12px; height:12px; border-radius:50%; }
                .sim-code { background:#1e1e2e; color:#cdd6f4; padding:16px; border-radius:12px; font-family:'Cascadia Code','Fira Code',monospace; font-size:13px; line-height:1.6; overflow-x:auto; }
                .sim-code .kw { color:#89b4fa; } .sim-code .fn { color:#a6e3a1; } .sim-code .str { color:#f9e2af; } .sim-code .num { color:#fab387; } .sim-code .cm { color:#6c7086; }
                .sim-toast { position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#1a2a6c; color:#fff; padding:12px 28px; border-radius:30px; font-size:14px; font-weight:600; z-index:999; animation:simFadeIn .3s; }
                @keyframes simFadeIn { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
                @keyframes simPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                @keyframes simSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes simWalk { 0%,100%{transform:translateX(0)} 50%{transform:translateX(20px)} }
                @keyframes simFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
                @media(max-width:600px){ .sim-grid-2,.sim-grid-3,.sim-grid-4{grid-template-columns:1fr} .sim-canvas{min-height:240px;padding:12px} }
                ${extraCss || ''}
            </style>
            <div class="sim-header">
                <span class="sim-badge">🧪 互动实验</span>
                <h3>${title}</h3>
            </div>
            <div class="sim-frame">
                <div class="sim-canvas" id="simCanvas">
                    ${html}
                </div>
            </div>
        </div>`;
    }

    function toast(msg) {
        const el = document.createElement('div');
        el.className = 'sim-toast';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
    }

    // ---------- 模拟器注册表 ----------
    const registry = {};

    // ============================================================
    //  R01: 机器人初探与感知世界
    // ============================================================

    registry['1-1'] = function() {
        const parts = [
            { icon:'🧱', name:'结构积木', desc:'搭建机器人骨架的基础零件' },
            { icon:'⚡', name:'马达', desc:'让机器人动起来的动力核心' },
            { icon:'🔄', name:'轮子', desc:'带动机器人移动的部件' },
            { icon:'👁️', name:'传感器', desc:'让机器人感知世界的眼睛耳朵' },
            { icon:'🧠', name:'控制器', desc:'机器人的大脑，处理信息' },
            { icon:'🔗', name:'连接线', desc:'连接各部件传递信号' }
        ];
        let selected = null;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">点击下方零件，了解机器人三要素：<strong>感知 → 思考 → 行动</strong></p>
            <div class="sim-grid sim-grid-3">
                ${parts.map((p,i) => `
                    <div class="sim-card" data-part="${i}">
                        <div class="sim-card-icon">${p.icon}</div>
                        <div class="sim-card-label">${p.name}</div>
                    </div>
                `).join('')}
            </div>
            <div id="partInfo" style="margin-top:16px;padding:16px;background:#e8f0fe;border-radius:12px;text-align:center;font-size:14px;color:#1a5276;">
                👆 点击上方零件查看详细介绍
            </div>
            <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;">
                <span style="background:#fdebd0;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:600;">👁️ 感知: 传感器</span>
                <span style="background:#d5f5e3;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:600;">🧠 思考: 控制器</span>
                <span style="background:#fadbd8;padding:4px 16px;border-radius:20px;font-size:12px;font-weight:600;">⚡ 行动: 马达+轮子</span>
            </div>
        `;
        const result = wrap('认识机器人朋友 — 零件探索', html);
        return {
            html: result,
            init: function(container) {
                container.querySelectorAll('[data-part]').forEach(el => {
                    el.addEventListener('click', function() {
                        const idx = parseInt(this.dataset.part);
                        const p = parts[idx];
                        container.querySelectorAll('[data-part]').forEach(c => c.classList.remove('selected'));
                        this.classList.add('selected');
                        const info = container.querySelector('#partInfo');
                        info.innerHTML = `<strong>${p.icon} ${p.name}</strong><br><span style="color:#4a3a2a;">${p.desc}</span>`;
                        toast('✅ 已选择: ' + p.name);
                    });
                });
            }
        };
    };

    registry['1-2'] = function() {
        let step = 0;
        const steps = [
            { text:'安装底盘', desc:'选择合适大小的底盘作为基础' },
            { text:'安装马达', desc:'将马达固定在底盘上' },
            { text:'安装轮子', desc:'将轮子安装到马达轴上' },
            { text:'连接控制器', desc:'连接控制器与马达' },
            { text:'测试运行', desc:'通电测试小车能否正常行驶' }
        ];
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">按步骤搭建你的第一台机器人小车 🚗</p>
            <div style="display:flex;justify-content:center;margin-bottom:16px;">
                <div class="sim-robot">
                    <div class="sim-robot-body" id="robotBody">
                        <div class="sim-robot-eye sim-robot-eye-left pupil"></div>
                        <div class="sim-robot-eye sim-robot-eye-right pupil"></div>
                        <div class="sim-robot-wheel sim-robot-wheel-left" id="wheelL"></div>
                        <div class="sim-robot-wheel sim-robot-wheel-right" id="wheelR"></div>
                    </div>
                </div>
            </div>
            <div id="buildProgress" style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:#7a6a5a;margin-bottom:4px;">
                    <span>搭建进度</span>
                    <span id="progressText">0/5</span>
                </div>
                <div class="sim-progress"><div class="sim-progress-bar" id="progressBar" style="width:0%"></div></div>
            </div>
            <div id="stepInfo" style="text-align:center;padding:12px;background:#f0ede4;border-radius:10px;font-size:14px;color:#4a3a2a;">
                👆 点击「下一步」开始搭建
            </div>
            <div class="sim-controls">
                <button class="sim-btn sim-btn-primary" id="prevBtn" disabled>← 上一步</button>
                <button class="sim-btn sim-btn-success" id="nextBtn">下一步 →</button>
                <button class="sim-btn sim-btn-outline" id="resetBtn">🔄 重置</button>
            </div>
        `;
        const result = wrap('搭建我的第一台小车 — 虚拟搭建', html);
        return {
            html: result,
            init: function(container) {
                const prevBtn = container.querySelector('#prevBtn');
                const nextBtn = container.querySelector('#nextBtn');
                const resetBtn = container.querySelector('#resetBtn');
                const stepInfo = container.querySelector('#stepInfo');
                const progressBar = container.querySelector('#progressBar');
                const progressText = container.querySelector('#progressText');
                const robotBody = container.querySelector('#robotBody');

                function updateStep() {
                    const s = steps[step];
                    stepInfo.innerHTML = `<strong>步骤 ${step+1}/${steps.length}：${s.text}</strong><br><span style="color:#7a6a5a;">${s.desc}</span>`;
                    progressBar.style.width = ((step+1)/steps.length*100) + '%';
                    progressText.textContent = `${step+1}/${steps.length}`;
                    prevBtn.disabled = step === 0;
                    nextBtn.disabled = step === steps.length - 1;
                    nextBtn.textContent = step === steps.length - 1 ? '✅ 完成搭建' : '下一步 →';
                    
                    // 更新机器人外观
                    if (step >= 1) robotBody.style.background = '#5cb85c';
                    if (step >= 2) {
                        container.querySelector('#wheelL').style.background = '#555';
                        container.querySelector('#wheelR').style.background = '#555';
                    }
                    if (step >= 3) robotBody.style.boxShadow = '0 0 20px rgba(74,144,217,.3)';
                    if (step >= 4) {
                        robotBody.style.animation = 'simPulse 1s infinite';
                        toast('🎉 小车搭建完成！');
                    }
                }

                nextBtn.addEventListener('click', function() {
                    if (step < steps.length - 1) {
                        step++;
                        updateStep();
                    }
                });
                prevBtn.addEventListener('click', function() {
                    if (step > 0) {
                        step--;
                        updateStep();
                    }
                });
                resetBtn.addEventListener('click', function() {
                    step = 0;
                    robotBody.style.background = '#4a90d9';
                    robotBody.style.boxShadow = 'none';
                    robotBody.style.animation = 'none';
                    container.querySelector('#wheelL').style.background = '#333';
                    container.querySelector('#wheelR').style.background = '#333';
                    updateStep();
                    toast('🔄 已重置');
                });
                updateStep();
            }
        };
    };

    registry['1-3'] = function() {
        let speed = 50, direction = 'forward';
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">控制小车前进、后退、转弯，编写指令序列</p>
            <div style="display:flex;justify-content:center;margin-bottom:16px;">
                <div style="position:relative;width:200px;height:200px;background:#f0ede4;border-radius:50%;border:2px dashed #d0c4b4;">
                    <div class="sim-robot" id="carMove" style="position:absolute;top:80px;left:60px;transition:all .5s;">
                        <div class="sim-robot-body" style="width:60px;height:40px;background:#4a90d9;border-radius:8px;">
                            <div class="sim-robot-eye sim-robot-eye-left pupil" style="top:8px;left:12px;"></div>
                            <div class="sim-robot-eye sim-robot-eye-right pupil" style="top:8px;right:12px;"></div>
                        </div>
                    </div>
                    <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:11px;color:#7a6a5a;">↑ 前进</div>
                    <div style="position:absolute;bottom:4px;left:50%;transform:translateX(-50%);font-size:11px;color:#7a6a5a;">↓ 后退</div>
                    <div style="position:absolute;top:50%;left:4px;transform:translateY(-50%);font-size:11px;color:#7a6a5a;">← 左转</div>
                    <div style="position:absolute;top:50%;right:4px;transform:translateY(-50%);font-size:11px;color:#7a6a5a;">→ 右转</div>
                </div>
            </div>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
                <div><span class="sim-label">速度</span> <input type="range" class="sim-slider" id="speedSlider" min="0" max="100" value="50"> <span class="sim-value" id="speedDisplay">50</span></div>
                <div><span class="sim-label">方向</span> <span class="sim-status sim-status-info" id="dirDisplay">⬆️ 前进</span></div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-primary" data-dir="forward">⬆️ 前进</button>
                <button class="sim-btn sim-btn-primary" data-dir="backward">⬇️ 后退</button>
                <button class="sim-btn sim-btn-primary" data-dir="left">⬅️ 左转</button>
                <button class="sim-btn sim-btn-primary" data-dir="right">➡️ 右转</button>
                <button class="sim-btn sim-btn-danger" id="stopBtn">⏹ 停止</button>
            </div>
            <div id="commandLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">
                📋 指令日志：等待操作...
            </div>
        `;
        const result = wrap('让小车动起来 — 运动控制', html);
        return {
            html: result,
            init: function(container) {
                const car = container.querySelector('#carMove');
                const speedSlider = container.querySelector('#speedSlider');
                const speedDisplay = container.querySelector('#speedDisplay');
                const dirDisplay = container.querySelector('#dirDisplay');
                const log = container.querySelector('#commandLog');
                let posX = 60, posY = 80, angle = 0;

                function addLog(msg) {
                    const time = new Date().toLocaleTimeString();
                    log.innerHTML += `<div>⏱ ${time} → ${msg}</div>`;
                    log.scrollTop = log.scrollHeight;
                }

                container.querySelectorAll('[data-dir]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const dir = this.dataset.dir;
                        const spd = parseInt(speedSlider.value) / 50;
                        const step = 8 * spd;
                        direction = dir;
                        
                        const dirNames = { forward:'⬆️ 前进', backward:'⬇️ 后退', left:'⬅️ 左转', right:'➡️ 右转' };
                        dirDisplay.textContent = dirNames[dir];
                        
                        if (dir === 'forward') posY = Math.max(0, posY - step);
                        else if (dir === 'backward') posY = Math.min(160, posY + step);
                        else if (dir === 'left') posX = Math.max(0, posX - step);
                        else if (dir === 'right') posX = Math.min(140, posX + step);
                        
                        car.style.top = posY + 'px';
                        car.style.left = posX + 'px';
                        addLog(`${dirNames[dir]} (速度:${speedSlider.value})`);
                    });
                });

                container.querySelector('#stopBtn').addEventListener('click', function() {
                    dirDisplay.textContent = '⏹ 已停止';
                    addLog('⏹ 停止运动');
                });

                speedSlider.addEventListener('input', function() {
                    speedDisplay.textContent = this.value;
                });

                addLog('🚀 系统就绪，等待指令');
            }
        };
    };

    registry['1-4'] = function() {
        let score = 0, round = 0;
        const colors = ['🔴 红色', '🟢 绿色', '🔵 蓝色', '🟡 黄色'];
        const actions = ['停止', '前进', '左转', '右转'];
        const correctMap = { '🔴 红色':'停止', '🟢 绿色':'前进', '🔵 蓝色':'左转', '🟡 黄色':'右转' };
        let currentColor = '';
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">颜色传感器挑战 — 看到颜色，做出正确反应！</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div id="colorDisplay" style="display:inline-block;width:120px;height:120px;border-radius:50%;background:#ddd;border:4px solid #e8e0d5;line-height:120px;font-size:24px;font-weight:800;transition:all .3s;">
                    🎯
                </div>
            </div>
            <div style="text-align:center;margin-bottom:12px;">
                <span class="sim-label">得分：</span><span class="sim-value" id="scoreDisplay">0</span>
                <span style="margin:0 16px;color:#d0c4b4;">|</span>
                <span class="sim-label">回合：</span><span class="sim-value" id="roundDisplay">0/8</span>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                ${actions.map(a => `<button class="sim-btn sim-btn-primary" data-action="${a}">${a}</button>`).join('')}
            </div>
            <div id="resultMsg" style="text-align:center;margin-top:12px;font-size:14px;font-weight:600;color:#4a3a2a;">
                👆 点击「开始挑战」按钮
            </div>
            <div class="sim-controls" style="justify-content:center;border-top:none;padding-top:0;">
                <button class="sim-btn sim-btn-success" id="startBtn">🎮 开始挑战</button>
                <button class="sim-btn sim-btn-outline" id="resetGameBtn">🔄 重新开始</button>
            </div>
        `;
        const result = wrap('颜色传感器大冒险 — 红停绿行', html);
        return {
            html: result,
            init: function(container) {
                const colorDisplay = container.querySelector('#colorDisplay');
                const scoreDisplay = container.querySelector('#scoreDisplay');
                const roundDisplay = container.querySelector('#roundDisplay');
                const resultMsg = container.querySelector('#resultMsg');
                const startBtn = container.querySelector('#startBtn');
                let active = false;

                function nextRound() {
                    if (round >= 8) {
                        resultMsg.innerHTML = `🎉 挑战完成！最终得分：<strong>${score}/8</strong>`;
                        if (score >= 6) resultMsg.innerHTML += ' 🏆 太棒了！';
                        else resultMsg.innerHTML += ' 💪 继续加油！';
                        active = false;
                        startBtn.textContent = '🔄 再来一次';
                        return;
                    }
                    round++;
                    currentColor = colors[Math.floor(Math.random() * colors.length)];
                    const colorMap = { '🔴 红色':'#e74c3c', '🟢 绿色':'#5cb85c', '🔵 蓝色':'#4a90d9', '🟡 黄色':'#f1c40f' };
                    colorDisplay.style.background = colorMap[currentColor];
                    colorDisplay.textContent = currentColor.split(' ')[0];
                    roundDisplay.textContent = `${round}/8`;
                    resultMsg.innerHTML = `🎯 第${round}回合：${currentColor}，请选择动作！`;
                    active = true;
                }

                container.querySelectorAll('[data-action]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (!active) {
                            toast('👆 请先点击「开始挑战」');
                            return;
                        }
                        const action = this.dataset.action;
                        const correct = correctMap[currentColor];
                        if (action === correct) {
                            score++;
                            scoreDisplay.textContent = score;
                            resultMsg.innerHTML = `✅ 正确！${currentColor} → ${action} 👍`;
                            toast('✅ 回答正确！');
                        } else {
                            resultMsg.innerHTML = `❌ 错误！${currentColor} 应该 ${correct}，不是 ${action}`;
                            toast('❌ 再想想~');
                        }
                        active = false;
                        setTimeout(nextRound, 1200);
                    });
                });

                startBtn.addEventListener('click', function() {
                    score = 0; round = 0; active = false;
                    scoreDisplay.textContent = '0';
                    nextRound();
                    this.textContent = '⏳ 进行中...';
                });

                container.querySelector('#resetGameBtn').addEventListener('click', function() {
                    score = 0; round = 0; active = false;
                    scoreDisplay.textContent = '0';
                    roundDisplay.textContent = '0/8';
                    colorDisplay.style.background = '#ddd';
                    colorDisplay.textContent = '🎯';
                    resultMsg.innerHTML = '🔄 已重置，点击「开始挑战」';
                    startBtn.textContent = '🎮 开始挑战';
                    toast('🔄 已重置');
                });
            }
        };
    };

    // ============================================================
    //  R02: 声音魔法师
    // ============================================================

    registry['2-1'] = function() {
        let isPlaying = false;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">声音是一种信号 — 用声音传感器检测音量变化</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;padding:20px 40px;background:#f0ede4;border-radius:20px;">
                    <div style="font-size:48px;animation:${isPlaying ? 'simPulse 1s infinite' : 'none'};">🔊</div>
                    <div style="margin-top:8px;"><span class="sim-label">当前音量：</span><span class="sim-value" id="volumeLevel">0 dB</span></div>
                    <div class="sim-progress" style="width:200px;margin:8px auto;">
                        <div class="sim-progress-bar" id="volumeBar" style="width:0%;background:linear-gradient(90deg,#5cb85c,#f1c40f,#e74c3c);"></div>
                    </div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-primary" id="makeSoundBtn">🔊 发出声音</button>
                <button class="sim-btn sim-btn-warning" id="loudSoundBtn">📢 大声喊</button>
                <button class="sim-btn sim-btn-outline" id="quietBtn">🤫 安静</button>
            </div>
            <div id="soundLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">
                📊 传感器就绪...
            </div>
        `;
        const result = wrap('声音探索家 — 声音信号检测', html);
        return {
            html: result,
            init: function(container) {
                const volumeBar = container.querySelector('#volumeBar');
                const volumeLevel = container.querySelector('#volumeLevel');
                const soundLog = container.querySelector('#soundLog');

                function setVolume(level, label) {
                    volumeBar.style.width = level + '%';
                    volumeLevel.textContent = level + ' dB';
                    const time = new Date().toLocaleTimeString();
                    soundLog.innerHTML += `<div>⏱ ${time} → 检测到声音：${level}dB (${label})</div>`;
                    soundLog.scrollTop = soundLog.scrollHeight;
                    
                    if (level > 70) toast('📢 声音很大！');
                    else if (level > 40) toast('🔊 正常音量');
                }

                container.querySelector('#makeSoundBtn').addEventListener('click', function() {
                    const level = 30 + Math.random() * 30;
                    setVolume(Math.round(level), '说话声');
                });
                container.querySelector('#loudSoundBtn').addEventListener('click', function() {
                    const level = 70 + Math.random() * 25;
                    setVolume(Math.round(level), '喊叫声');
                });
                container.querySelector('#quietBtn').addEventListener('click', function() {
                    setVolume(5 + Math.random() * 10, '安静环境');
                });
            }
        };
    };

    registry['2-2'] = function() {
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">设定声音阈值，用声音控制机器人动作</p>
            <div style="display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin-bottom:16px;">
                <div style="text-align:center;">
                    <div class="sim-robot">
                        <div class="sim-robot-body" id="voiceRobot" style="background:#4a90d9;">
                            <div class="sim-robot-eye sim-robot-eye-left pupil"></div>
                            <div class="sim-robot-eye sim-robot-eye-right pupil"></div>
                            <div class="sim-robot-wheel sim-robot-wheel-left"></div>
                            <div class="sim-robot-wheel sim-robot-wheel-right"></div>
                        </div>
                    </div>
                    <div style="margin-top:8px;font-size:13px;font-weight:600;color:#4a3a2a;" id="robotState">⏹ 等待指令</div>
                </div>
                <div style="text-align:left;padding:12px;background:#f0ede4;border-radius:12px;">
                    <div class="sim-label">🎯 阈值设定</div>
                    <input type="range" class="sim-slider" id="thresholdSlider" min="10" max="90" value="40" style="width:160px;">
                    <div><span class="sim-value" id="thresholdDisplay">40</span> <span style="font-size:13px;color:#7a6a5a;">dB</span></div>
                    <div style="margin-top:8px;font-size:12px;color:#7a6a5a;">超过阈值 → 机器人前进</div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-primary" id="voiceCmdBtn">🔊 发出指令 (超过阈值)</button>
                <button class="sim-btn sim-btn-outline" id="quietCmdBtn">🤫 轻声 (低于阈值)</button>
            </div>
            <div id="voiceLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                🎤 声控系统就绪...
            </div>
        `;
        const result = wrap('声控编程师 — 口令控制机器人', html);
        return {
            html: result,
            init: function(container) {
                const robot = container.querySelector('#voiceRobot');
                const state = container.querySelector('#robotState');
                const thresholdSlider = container.querySelector('#thresholdSlider');
                const thresholdDisplay = container.querySelector('#thresholdDisplay');
                const voiceLog = container.querySelector('#voiceLog');

                thresholdSlider.addEventListener('input', function() {
                    thresholdDisplay.textContent = this.value;
                });

                function log(msg) {
                    const time = new Date().toLocaleTimeString();
                    voiceLog.innerHTML += `<div>⏱ ${time} → ${msg}</div>`;
                    voiceLog.scrollTop = voiceLog.scrollHeight;
                }

                container.querySelector('#voiceCmdBtn').addEventListener('click', function() {
                    const vol = parseInt(thresholdSlider.value) + 10 + Math.random() * 20;
                    robot.style.animation = 'simWalk .5s infinite';
                    state.textContent = '🚀 前进中...';
                    state.style.color = '#5cb85c';
                    log(`🎤 声控指令！音量 ${Math.round(vol)}dB > 阈值 ${thresholdSlider.value}dB → 前进`);
                    toast('🚀 机器人前进！');
                    setTimeout(() => {
                        robot.style.animation = 'none';
                        state.textContent = '⏹ 指令执行完毕';
                        state.style.color = '#4a3a2a';
                    }, 1500);
                });

                container.querySelector('#quietCmdBtn').addEventListener('click', function() {
                    const vol = Math.random() * (parseInt(thresholdSlider.value) - 5);
                    state.textContent = '⏹ 音量不足，未触发';
                    state.style.color = '#7a6a5a';
                    log(`🤫 音量不足 ${Math.round(vol)}dB < 阈值 ${thresholdSlider.value}dB → 无动作`);
                });
            }
        };
    };

    registry['2-3'] = function() {
        const notes = [
            { name:'Do', freq:262, key:'C' },
            { name:'Re', freq:294, key:'D' },
            { name:'Mi', freq:330, key:'E' },
            { name:'Fa', freq:349, key:'F' },
            { name:'Sol', freq:392, key:'G' },
            { name:'La', freq:440, key:'A' },
            { name:'Si', freq:494, key:'B' }
        ];
        const melody = [
            { note:0, dur:400 }, { note:0, dur:400 }, { note:2, dur:400 }, { note:2, dur:400 },
            { note:4, dur:400 }, { note:4, dur:400 }, { note:2, dur:800 },
            { note:1, dur:400 }, { note:1, dur:400 }, { note:3, dur:400 }, { note:3, dur:400 },
            { note:4, dur:400 }, { note:4, dur:400 }, { note:2, dur:800 }
        ];
        let melodyIdx = 0;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">用蜂鸣器演奏音符，编写你的第一首旋律</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;">
                    <div style="font-size:40px;">🎵</div>
                    <div style="font-size:28px;font-weight:800;color:#1a2a6c;font-family:'Cormorant Garamond',serif;" id="currentNote">—</div>
                </div>
            </div>
            <div class="sim-grid sim-grid-4" style="margin-bottom:12px;">
                ${notes.map((n,i) => `
                    <div class="sim-card" data-note="${i}">
                        <div style="font-size:24px;font-weight:800;color:#1a2a6c;font-family:'Cormorant Garamond',serif;">${n.name}</div>
                        <div style="font-size:11px;color:#7a6a5a;">${n.freq}Hz</div>
                    </div>
                `).join('')}
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" id="playMelodyBtn">🎶 播放《小星星》</button>
                <button class="sim-btn sim-btn-outline" id="stopMelodyBtn">⏹ 停止</button>
            </div>
            <div id="melodyLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                🎼 蜂鸣器就绪...
            </div>
        `;
        const result = wrap('音乐编程师 — 蜂鸣器演奏', html);
        return {
            html: result,
            init: function(container) {
                const currentNote = container.querySelector('#currentNote');
                const melodyLog = container.querySelector('#melodyLog');
                let playing = false;
                let timer = null;

                function log(msg) {
                    const time = new Date().toLocaleTimeString();
                    melodyLog.innerHTML += `<div>⏱ ${time} → ${msg}</div>`;
                    melodyLog.scrollTop = melodyLog.scrollHeight;
                }

                container.querySelectorAll('[data-note]').forEach(el => {
                    el.addEventListener('click', function() {
                        const idx = parseInt(this.dataset.note);
                        const n = notes[idx];
                        currentNote.textContent = n.name;
                        container.querySelectorAll('[data-note]').forEach(c => c.classList.remove('selected'));
                        this.classList.add('selected');
                        log(`🎵 演奏 ${n.name} (${n.freq}Hz)`);
                        toast(`🎵 ${n.name}`);
                    });
                });

                container.querySelector('#playMelodyBtn').addEventListener('click', function() {
                    if (playing) return;
                    playing = true;
                    melodyIdx = 0;
                    log('🎶 开始播放《小星星》');
                    
                    function playNext() {
                        if (!playing || melodyIdx >= melody.length) {
                            playing = false;
                            currentNote.textContent = '✓';
                            log('🎶 播放完成！');
                            toast('🎶 演奏结束！');
                            return;
                        }
                        const m = melody[melodyIdx];
                        const n = notes[m.note];
                        currentNote.textContent = n.name;
                        container.querySelectorAll('[data-note]').forEach(c => c.classList.remove('selected'));
                        container.querySelector(`[data-note="${m.note}"]`)?.classList.add('selected');
                        melodyIdx++;
                        timer = setTimeout(playNext, m.dur);
                    }
                    playNext();
                });

                container.querySelector('#stopMelodyBtn').addEventListener('click', function() {
                    playing = false;
                    if (timer) clearTimeout(timer);
                    currentNote.textContent = '⏹';
                    log('⏹ 播放已停止');
                });
            }
        };
    };

    registry['2-4'] = function() {
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">综合声控和蜂鸣器，设计一个互动小剧场</p>
            <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">
                <div style="text-align:center;padding:16px;background:#f0ede4;border-radius:16px;width:160px;">
                    <div style="font-size:36px;">🎭</div>
                    <div style="font-size:13px;font-weight:600;color:#4a3a2a;">舞台</div>
                    <div style="font-size:12px;color:#7a6a5a;" id="sceneDisplay">等待开场</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0ede4;border-radius:16px;width:160px;">
                    <div style="font-size:36px;">🤖</div>
                    <div style="font-size:13px;font-weight:600;color:#4a3a2a;">机器人演员</div>
                    <div style="font-size:12px;color:#7a6a5a;" id="actorDisplay">准备就绪</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0ede4;border-radius:16px;width:160px;">
                    <div style="font-size:36px;">🎵</div>
                    <div style="font-size:13px;font-weight:600;color:#4a3a2a;">背景音乐</div>
                    <div style="font-size:12px;color:#7a6a5a;" id="musicDisplay">静音</div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-primary" data-scene="1">🎬 场景1: 机器人醒来</button>
                <button class="sim-btn sim-btn-primary" data-scene="2">🎬 场景2: 机器人跳舞</button>
                <button class="sim-btn sim-btn-primary" data-scene="3">🎬 场景3: 机器人谢幕</button>
            </div>
            <div id="theaterLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                🎭 剧场控制系统就绪...
            </div>
        `;
        const result = wrap('互动剧场导演 — 声控小剧场', html);
        return {
            html: result,
            init: function(container) {
                const sceneDisplay = container.querySelector('#sceneDisplay');
                const actorDisplay = container.querySelector('#actorDisplay');
                const musicDisplay = container.querySelector('#musicDisplay');
                const theaterLog = container.querySelector('#theaterLog');

                const scenes = {
                    1: { scene:'🌅 清晨', actor:'🤖 机器人伸懒腰醒来', music:'🎵 轻柔的起床音乐', log:'机器人被闹钟唤醒，伸了个懒腰' },
                    2: { scene:'💃 舞池', actor:'🤖 机器人欢快跳舞', music:'🎵 动感的舞曲', log:'机器人随着音乐节奏舞动' },
                    3: { scene:'🎉 谢幕', actor:'🤖 机器人鞠躬致谢', music:'🎵 隆重的谢幕曲', log:'机器人完成表演，向观众鞠躬' }
                };

                container.querySelectorAll('[data-scene]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const s = scenes[this.dataset.scene];
                        sceneDisplay.textContent = s.scene;
                        actorDisplay.textContent = s.actor;
                        musicDisplay.textContent = s.music;
                        const time = new Date().toLocaleTimeString();
                        theaterLog.innerHTML += `<div>⏱ ${time} → ${s.log}</div>`;
                        theaterLog.scrollTop = theaterLog.scrollHeight;
                        toast(`🎬 ${s.scene}`);
                    });
                });
            }
        };
    };

    // ============================================================
    //  R03: 机械小达人
    // ============================================================

    registry['3-1'] = function() {
        let fulcrum = 50;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">调整支点位置，体验杠杆原理</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="position:relative;width:300px;height:120px;margin:0 auto;background:#f0ede4;border-radius:12px;overflow:hidden;">
                    <div style="position:absolute;bottom:0;left:${fulcrum}%;transform:translateX(-50%);width:16px;height:40px;background:#555;border-radius:4px 4px 0 0;z-index:2;"></div>
                    <div style="position:absolute;bottom:20px;left:0;width:300px;height:8px;background:#8B4513;border-radius:4px;transform-origin:${fulcrum}% bottom;transition:transform .3s;" id="leverBar"></div>
                    <div style="position:absolute;bottom:28px;left:20px;font-size:24px;transition:all .3s;" id="leftWeight">⬇️</div>
                    <div style="position:absolute;bottom:28px;right:20px;font-size:24px;transition:all .3s;" id="rightWeight">⬆️</div>
                </div>
                <div style="margin-top:8px;">
                    <span class="sim-label">支点位置：</span>
                    <input type="range" class="sim-slider" id="fulcrumSlider" min="10" max="90" value="50" style="width:200px;">
                    <span class="sim-value" id="fulcrumDisplay">50%</span>
                </div>
            </div>
            <div id="leverInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">
                💡 支点在中间 → 平衡状态
            </div>
        `;
        const result = wrap('杠杆工程师 — 杠杆原理探索', html);
        return {
            html: result,
            init: function(container) {
                const leverBar = container.querySelector('#leverBar');
                const fulcrumSlider = container.querySelector('#fulcrumSlider');
                const fulcrumDisplay = container.querySelector('#fulcrumDisplay');
                const leverInfo = container.querySelector('#leverInfo');
                const leftWeight = container.querySelector('#leftWeight');
                const rightWeight = container.querySelector('#rightWeight');

                fulcrumSlider.addEventListener('input', function() {
                    const val = parseInt(this.value);
                    fulcrumDisplay.textContent = val + '%';
                    const tilt = (val - 50) * 0.3;
                    leverBar.style.transform = `rotate(${tilt}deg)`;
                    leverBar.style.transformOrigin = `${val}% bottom`;
                    
                    if (val < 40) {
                        leverInfo.innerHTML = '💡 支点靠近左侧 → 右侧力臂长，右侧更省力 ⬆️';
                        leftWeight.textContent = '⬇️';
                        rightWeight.textContent = '⬆️⬆️';
                    } else if (val > 60) {
                        leverInfo.innerHTML = '💡 支点靠近右侧 → 左侧力臂长，左侧更省力 ⬆️';
                        leftWeight.textContent = '⬆️⬆️';
                        rightWeight.textContent = '⬇️';
                    } else {
                        leverInfo.innerHTML = '💡 支点在中间 → 平衡状态 ⚖️';
                        leftWeight.textContent = '⬇️';
                        rightWeight.textContent = '⬆️';
                    }
                });
            }
        };
    };

    registry['3-2'] = function() {
        let gearRatio = 1;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">改变齿轮比，观察速度变化</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-flex;align-items:center;gap:8px;padding:20px;background:#f0ede4;border-radius:16px;">
                    <div style="width:60px;height:60px;border-radius:50%;background:#4a90d9;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;animation:simSpin 2s linear infinite;" id="gearA">⚙</div>
                    <div style="font-size:20px;color:#7a6a5a;">→</div>
                    <div style="width:40px;height:40px;border-radius:50%;background:#e67e22;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;animation:simSpin 1.33s linear infinite;" id="gearB">⚙</div>
                </div>
            </div>
            <div style="text-align:center;margin-bottom:12px;">
                <span class="sim-label">齿轮比：</span>
                <input type="range" class="sim-slider" id="gearSlider" min="1" max="5" value="1" step="1" style="width:200px;">
                <span class="sim-value" id="gearDisplay">1:1</span>
            </div>
            <div id="gearInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">
                💡 齿轮比 1:1 → 速度相同
            </div>
        `;
        const result = wrap('齿轮传动师 — 齿轮比实验', html);
        return {
            html: result,
            init: function(container) {
                const gearA = container.querySelector('#gearA');
                const gearB = container.querySelector('#gearB');
                const gearSlider = container.querySelector('#gearSlider');
                const gearDisplay = container.querySelector('#gearDisplay');
                const gearInfo = container.querySelector('#gearInfo');

                gearSlider.addEventListener('input', function() {
                    const ratio = parseInt(this.value);
                    gearDisplay.textContent = `${ratio}:1`;
                    const speedB = 2 * ratio;
                    gearB.style.animationDuration = (2/speedB) + 's';
                    
                    if (ratio === 1) {
                        gearInfo.innerHTML = '💡 齿轮比 1:1 → 速度相同，扭矩相同 ⚖️';
                    } else if (ratio < 3) {
                        gearInfo.innerHTML = `💡 齿轮比 ${ratio}:1 → 从动轮加速，扭矩减小 ⚡`;
                    } else {
                        gearInfo.innerHTML = `💡 齿轮比 ${ratio}:1 → 从动轮高速旋转，扭矩大幅减小 🚀`;
                    }
                });
            }
        };
    };

    registry['3-3'] = function() {
        let pulleyType = 'fixed';
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">探索定滑轮和动滑轮的力学原理</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;padding:20px;background:#f0ede4;border-radius:16px;">
                    <div style="font-size:48px;" id="pulleyIcon">🔄</div>
                    <div style="font-size:14px;font-weight:600;color:#4a3a2a;" id="pulleyTypeDisplay">定滑轮</div>
                    <div style="margin-top:8px;">
                        <span class="sim-label">所需拉力：</span>
                        <span class="sim-value" id="forceDisplay">100%</span>
                    </div>
                    <div class="sim-progress" style="width:160px;margin:8px auto;">
                        <div class="sim-progress-bar" id="forceBar" style="width:100%;background:linear-gradient(90deg,#5cb85c,#f1c40f,#e74c3c);"></div>
                    </div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-primary" data-type="fixed">🔄 定滑轮</button>
                <button class="sim-btn sim-btn-primary" data-type="movable">🔃 动滑轮</button>
                <button class="sim-btn sim-btn-primary" data-type="compound">⚙️ 滑轮组</button>
            </div>
            <div id="pulleyInfo" style="text-align:center;margin-top:12px;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">
                💡 定滑轮：改变力的方向，不省力
            </div>
        `;
        const result = wrap('滑轮设计师 — 滑轮系统模拟', html);
        return {
            html: result,
            init: function(container) {
                const pulleyIcon = container.querySelector('#pulleyIcon');
                const pulleyTypeDisplay = container.querySelector('#pulleyTypeDisplay');
                const forceDisplay = container.querySelector('#forceDisplay');
                const forceBar = container.querySelector('#forceBar');
                const pulleyInfo = container.querySelector('#pulleyInfo');

                const types = {
                    fixed: { icon:'🔄', name:'定滑轮', force:100, desc:'改变力的方向，不省力。就像升旗杆顶端的滑轮。' },
                    movable: { icon:'🔃', name:'动滑轮', force:50, desc:'省一半力，但不改变方向。就像吊车上的滑轮。' },
                    compound: { icon:'⚙️', name:'滑轮组', force:25, desc:'既省力又改变方向，n段绳子省力n倍！' }
                };

                container.querySelectorAll('[data-type]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const t = types[this.dataset.type];
                        pulleyIcon.textContent = t.icon;
                        pulleyTypeDisplay.textContent = t.name;
                        forceDisplay.textContent = t.force + '%';
                        forceBar.style.width = t.force + '%';
                        pulleyInfo.innerHTML = `💡 ${t.name}：${t.desc}`;
                        toast(`✅ 切换到${t.name}`);
                    });
                });
            }
        };
    };

    registry['3-4'] = function() {
        let angle1 = 45, angle2 = 90, angle3 = 135;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">调整机械手臂各关节角度，抓取目标</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="position:relative;width:240px;height:200px;margin:0 auto;background:#f0ede4;border-radius:16px;overflow:hidden;">
                    <canvas id="armCanvas" width="240" height="200" style="width:240px;height:200px;"></canvas>
                </div>
            </div>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
                <div><span class="sim-label">关节1</span> <input type="range" class="sim-slider" id="joint1" min="0" max="180" value="45" style="width:120px;"> <span class="sim-value" id="j1v">45°</span></div>
                <div><span class="sim-label">关节2</span> <input type="range" class="sim-slider" id="joint2" min="0" max="180" value="90" style="width:120px;"> <span class="sim-value" id="j2v">90°</span></div>
                <div><span class="sim-label">关节3</span> <input type="range" class="sim-slider" id="joint3" min="0" max="180" value="135" style="width:120px;"> <span class="sim-value" id="j3v">135°</span></div>
            </div>
            <div id="armInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">
                💡 调整关节角度，控制机械手臂末端位置
            </div>
        `;
        const result = wrap('机械手臂设计师 — 虚拟机械臂', html);
        return {
            html: result,
            init: function(container) {
                const canvas = container.querySelector('#armCanvas');
                const ctx = canvas.getContext('2d');
                const j1 = container.querySelector('#joint1');
                const j2 = container.querySelector('#joint2');
                const j3 = container.querySelector('#joint3');
                const j1v = container.querySelector('#j1v');
                const j2v = container.querySelector('#j2v');
                const j3v = container.querySelector('#j3v');
                const armInfo = container.querySelector('#armInfo');

                function drawArm() {
                    ctx.clearRect(0, 0, 240, 200);
                    const a1 = parseInt(j1.value) * Math.PI / 180;
                    const a2 = parseInt(j2.value) * Math.PI / 180;
                    const a3 = parseInt(j3.value) * Math.PI / 180;
                    
                    const baseX = 120, baseY = 180;
                    const seg1 = 50, seg2 = 45, seg3 = 40;
                    
                    const x1 = baseX + seg1 * Math.sin(a1);
                    const y1 = baseY - seg1 * Math.cos(a1);
                    const x2 = x1 + seg2 * Math.sin(a1 + a2 - Math.PI/2);
                    const y2 = y1 - seg2 * Math.cos(a1 + a2 - Math.PI/2);
                    const x3 = x2 + seg3 * Math.sin(a1 + a2 + a3 - Math.PI);
                    const y3 = y2 - seg3 * Math.cos(a1 + a2 + a3 - Math.PI);

                    // 底座
                    ctx.fillStyle = '#555';
                    ctx.fillRect(baseX-15, baseY-5, 30, 20);
                    
                    // 关节1
                    ctx.strokeStyle = '#4a90d9';
                    ctx.lineWidth = 8;
                    ctx.lineCap = 'round';
                    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(x1, y1); ctx.stroke();
                    ctx.fillStyle = '#1a2a6c';
                    ctx.beginPath(); ctx.arc(baseX, baseY, 6, 0, 2*Math.PI); ctx.fill();
                    
                    // 关节2
                    ctx.strokeStyle = '#e67e22';
                    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                    ctx.fillStyle = '#d4701a';
                    ctx.beginPath(); ctx.arc(x1, y1, 5, 0, 2*Math.PI); ctx.fill();
                    
                    // 关节3
                    ctx.strokeStyle = '#5cb85c';
                    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x3, y3); ctx.stroke();
                    ctx.fillStyle = '#4a9a4a';
                    ctx.beginPath(); ctx.arc(x2, y2, 4, 0, 2*Math.PI); ctx.fill();
                    
                    // 末端
                    ctx.fillStyle = '#e74c3c';
                    ctx.beginPath(); ctx.arc(x3, y3, 6, 0, 2*Math.PI); ctx.fill();
                    ctx.fillStyle = '#fff';
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('🤖 抓取', x3, y3-12);

                    j1v.textContent = j1.value + '°';
                    j2v.textContent = j2.value + '°';
                    j3v.textContent = j3.value + '°';
                    
                    const dist = Math.sqrt((x3-120)**2 + (y3-180)**2);
                    armInfo.innerHTML = `💡 末端位置 (${Math.round(x3)}, ${Math.round(y3)}) | 伸展距离 ${Math.round(dist)}px`;
                }

                j1.addEventListener('input', drawArm);
                j2.addEventListener('input', drawArm);
                j3.addEventListener('input', drawArm);
                drawArm();
            }
        };
    };

    // ============================================================
    //  R04: AI小侦探
    // ============================================================

    registry['4-1'] = function() {
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">操作摄像头模块，体验AI视觉采集</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;width:240px;height:180px;background:#1e1e2e;border-radius:12px;position:relative;overflow:hidden;" id="cameraView">
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6c7086;font-size:14px;" id="camStatus">📷 摄像头待机中</div>
                    <div style="position:absolute;top:8px;left:8px;width:8px;height:8px;border-radius:50%;background:#e74c3c;" id="recDot"></div>
                    <div style="position:absolute;bottom:8px;left:8px;color:#cdd6f4;font-size:11px;font-family:monospace;" id="camInfo">分辨率: 640×480</div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" id="camOnBtn">📷 开启摄像头</button>
                <button class="sim-btn sim-btn-warning" id="captureBtn">📸 拍照</button>
                <button class="sim-btn sim-btn-danger" id="camOffBtn">⏹ 关闭</button>
            </div>
            <div id="camLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                📹 视觉系统就绪...
            </div>
        `;
        const result = wrap('视觉认知师 — 摄像头操作', html);
        return {
            html: result,
            init: function(container) {
                const camView = container.querySelector('#cameraView');
                const camStatus = container.querySelector('#camStatus');
                const recDot = container.querySelector('#recDot');
                const camInfo = container.querySelector('#camInfo');
                const camLog = container.querySelector('#camLog');
                let active = false;

                function log(msg) {
                    const t = new Date().toLocaleTimeString();
                    camLog.innerHTML += `<div>⏱ ${t} → ${msg}</div>`;
                    camLog.scrollTop = camLog.scrollHeight;
                }

                container.querySelector('#camOnBtn').addEventListener('click', function() {
                    active = true;
                    camStatus.textContent = '🟢 实时画面';
                    camStatus.style.color = '#a6e3a1';
                    recDot.style.animation = 'simPulse 1s infinite';
                    camView.style.background = 'linear-gradient(135deg,#2d4a8e,#4a90d9)';
                    log('📷 摄像头已开启');
                    toast('📷 摄像头已开启');
                });

                container.querySelector('#captureBtn').addEventListener('click', function() {
                    if (!active) { toast('⚠️ 请先开启摄像头'); return; }
                    camView.style.background = '#fff';
                    setTimeout(() => { camView.style.background = 'linear-gradient(135deg,#2d4a8e,#4a90d9)'; }, 200);
                    log('📸 已拍照！图像已保存');
                    toast('📸 拍照成功！');
                });

                container.querySelector('#camOffBtn').addEventListener('click', function() {
                    active = false;
                    camStatus.textContent = '📷 摄像头待机中';
                    camStatus.style.color = '#6c7086';
                    recDot.style.animation = 'none';
                    camView.style.background = '#1e1e2e';
                    log('⏹ 摄像头已关闭');
                });
            }
        };
    };

    registry['4-2'] = function() {
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">录入人脸数据，体验AI人脸识别</p>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:16px;">
                <div style="text-align:center;padding:16px;background:#f0ede4;border-radius:16px;width:140px;">
                    <div style="font-size:48px;" id="faceIcon">👤</div>
                    <div style="font-size:13px;font-weight:600;color:#4a3a2a;" id="faceName">未识别</div>
                    <div style="font-size:12px;color:#7a6a5a;" id="faceConfidence">置信度: —</div>
                </div>
                <div style="text-align:center;padding:16px;background:#f0ede4;border-radius:16px;width:140px;">
                    <div style="font-size:13px;font-weight:600;color:#4a3a2a;margin-bottom:8px;">已录入人脸</div>
                    <div id="faceList" style="font-size:12px;color:#7a6a5a;">暂无数据</div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" id="enrollBtn">📝 录入人脸</button>
                <button class="sim-btn sim-btn-primary" id="recognizeBtn">🔍 识别</button>
                <button class="sim-btn sim-btn-outline" id="clearFacesBtn">🗑️ 清空</button>
            </div>
            <div id="faceLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                👤 人脸识别系统就绪...
            </div>
        `;
        const result = wrap('人脸识别师 — 人脸录入与识别', html);
        return {
            html: result,
            init: function(container) {
                const faceIcon = container.querySelector('#faceIcon');
                const faceName = container.querySelector('#faceName');
                const faceConfidence = container.querySelector('#faceConfidence');
                const faceList = container.querySelector('#faceList');
                const faceLog = container.querySelector('#faceLog');
                const names = ['小明','小红','小刚','小美','小华'];
                let enrolled = [];

                function log(msg) {
                    const t = new Date().toLocaleTimeString();
                    faceLog.innerHTML += `<div>⏱ ${t} → ${msg}</div>`;
                    faceLog.scrollTop = faceLog.scrollHeight;
                }

                container.querySelector('#enrollBtn').addEventListener('click', function() {
                    if (enrolled.length >= 5) { toast('⚠️ 最多录入5人'); return; }
                    const name = names[enrolled.length];
                    enrolled.push(name);
                    faceList.innerHTML = enrolled.map(n => `<div style="margin:2px 0;">✅ ${n}</div>`).join('');
                    log(`📝 已录入: ${name}`);
                    toast(`✅ 已录入 ${name}`);
                });

                container.querySelector('#recognizeBtn').addEventListener('click', function() {
                    if (enrolled.length === 0) { toast('⚠️ 请先录入人脸'); return; }
                    const idx = Math.floor(Math.random() * enrolled.length);
                    const conf = (85 + Math.random() * 14).toFixed(1);
                    faceIcon.textContent = '🧑';
                    faceName.textContent = enrolled[idx];
                    faceConfidence.textContent = `置信度: ${conf}%`;
                    log(`🔍 识别成功: ${enrolled[idx]} (${conf}%)`);
                    toast(`🔍 识别: ${enrolled[idx]}`);
                });

                container.querySelector('#clearFacesBtn').addEventListener('click', function() {
                    enrolled = [];
                    faceList.innerHTML = '暂无数据';
                    faceIcon.textContent = '👤';
                    faceName.textContent = '未识别';
                    faceConfidence.textContent = '置信度: —';
                    log('🗑️ 已清空所有人脸数据');
                    toast('🗑️ 已清空');
                });
            }
        };
    };

    registry['4-3'] = function() {
        const items = ['🍎 苹果','🍌 香蕉','🥕 胡萝卜','🥦 西兰花','🍇 葡萄'];
        const categories = ['水果','蔬菜'];
        const correctCat = { '🍎 苹果':'水果','🍌 香蕉':'水果','🥕 胡萝卜':'蔬菜','🥦 西兰花':'蔬菜','🍇 葡萄':'水果' };
        let score = 0, total = 0, currentItem = '';
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">用AI视觉模块分类物品，训练分类模型</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;padding:20px 40px;background:#f0ede4;border-radius:16px;">
                    <div style="font-size:48px;" id="itemIcon">🎯</div>
                    <div style="font-size:16px;font-weight:700;color:#4a3a2a;" id="itemName">点击开始</div>
                </div>
            </div>
            <div style="text-align:center;margin-bottom:12px;">
                <span class="sim-label">得分：</span><span class="sim-value" id="classScore">0</span>
                <span style="margin:0 12px;color:#d0c4b4;">|</span>
                <span class="sim-label">进度：</span><span class="sim-value" id="classProgress">0/10</span>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" data-cat="水果">🍎 水果</button>
                <button class="sim-btn sim-btn-primary" data-cat="蔬菜">🥦 蔬菜</button>
                <button class="sim-btn sim-btn-outline" id="resetClassBtn">🔄 重置</button>
            </div>
            <div id="classLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                🏷️ 分类系统就绪...
            </div>
        `;
        const result = wrap('物品分类师 — AI物品分类', html);
        return {
            html: result,
            init: function(container) {
                const itemIcon = container.querySelector('#itemIcon');
                const itemName = container.querySelector('#itemName');
                const classScore = container.querySelector('#classScore');
                const classProgress = container.querySelector('#classProgress');
                const classLog = container.querySelector('#classLog');

                function nextItem() {
                    if (total >= 10) {
                        itemName.textContent = `完成！得分 ${score}/10`;
                        itemIcon.textContent = score >= 8 ? '🏆' : '💪';
                        toast(`🎉 完成！${score}/10`);
                        return;
                    }
                    currentItem = items[Math.floor(Math.random() * items.length)];
                    itemIcon.textContent = currentItem.split(' ')[0];
                    itemName.textContent = currentItem;
                    total++;
                    classProgress.textContent = `${total}/10`;
                }

                container.querySelectorAll('[data-cat]').forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (!currentItem) { nextItem(); return; }
                        const cat = this.dataset.cat;
                        const correct = correctCat[currentItem];
                        if (cat === correct) {
                            score++;
                            classScore.textContent = score;
                            toast('✅ 正确！');
                        } else {
                            toast(`❌ 应该是${correct}`);
                        }
                        currentItem = '';
                        setTimeout(nextItem, 800);
                    });
                });

                container.querySelector('#resetClassBtn').addEventListener('click', function() {
                    score = 0; total = 0; currentItem = '';
                    classScore.textContent = '0';
                    classProgress.textContent = '0/10';
                    itemIcon.textContent = '🎯';
                    itemName.textContent = '点击开始';
                    toast('🔄 已重置');
                });
                nextItem();
            }
        };
    };

    registry['4-4'] = function() {
        let targetX = 150, targetY = 100, robotX = 50, robotY = 150;
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">让机器人跟随移动的目标</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="position:relative;width:300px;height:200px;margin:0 auto;background:#f0ede4;border-radius:12px;overflow:hidden;" id="followArea">
                    <div style="position:absolute;font-size:24px;transition:all .5s;" id="targetObj">🎯</div>
                    <div style="position:absolute;font-size:24px;transition:all .8s;" id="followRobot">🤖</div>
                </div>
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" id="moveTargetBtn">🎯 移动目标</button>
                <button class="sim-btn sim-btn-primary" id="startFollowBtn">🚀 开始跟随</button>
                <button class="sim-btn sim-btn-outline" id="resetFollowBtn">🔄 重置</button>
            </div>
            <div id="followLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">
                🎯 跟随系统就绪...
            </div>
        `;
        const result = wrap('目标跟随师 — 视觉跟随', html);
        return {
            html: result,
            init: function(container) {
                const target = container.querySelector('#targetObj');
                const robot = container.querySelector('#followRobot');
                const followLog = container.querySelector('#followLog');
                let following = false;
                let followTimer = null;

                function log(msg) {
                    const t = new Date().toLocaleTimeString();
                    followLog.innerHTML += `<div>⏱ ${t} → ${msg}</div>`;
                    followLog.scrollTop = followLog.scrollHeight;
                }

                function moveTarget() {
                    targetX = 20 + Math.random() * 260;
                    targetY = 20 + Math.random() * 160;
                    target.style.left = targetX + 'px';
                    target.style.top = targetY + 'px';
                    log(`🎯 目标移动到 (${Math.round(targetX)}, ${Math.round(targetY)})`);
                }

                function followTarget() {
                    if (!following) return;
                    const dx = targetX - robotX;
                    const dy = targetY - robotY;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist > 30) {
                        robotX += dx * 0.15;
                        robotY += dy * 0.15;
                        robot.style.left = robotX + 'px';
                        robot.style.top = robotY + 'px';
                    } else {
                        log('✅ 已到达目标附近！');
                        toast('✅ 跟随成功！');
                    }
                    followTimer = setTimeout(followTarget, 100);
                }

                container.querySelector('#moveTargetBtn').addEventListener('click', moveTarget);
                container.querySelector('#startFollowBtn').addEventListener('click', function() {
                    following = true;
                    log('🚀 开始跟随目标');
                    followTarget();
                });
                container.querySelector('#resetFollowBtn').addEventListener('click', function() {
                    following = false;
                    if (followTimer) clearTimeout(followTimer);
                    robotX = 50; robotY = 150;
                    robot.style.left = '50px';
                    robot.style.top = '150px';
                    log('🔄 已重置');
                });
                target.style.left = '150px'; target.style.top = '100px';
                robot.style.left = '50px'; robot.style.top = '150px';
            }
        };
    };

    // ============================================================
    //  R05-R12: 成长期 & 硬核期 (简化版模拟)
    // ============================================================

    // 通用模拟器生成器
    function createGenericSim(courseCode, courseTitle, lessonNum, lessonTopic, config) {
        const html = `
            <p style="text-align:center;color:#4a3a2a;margin-bottom:16px;font-size:14px;">${config.desc}</p>
            <div style="text-align:center;margin-bottom:16px;">
                <div style="display:inline-block;padding:20px 40px;background:#f0ede4;border-radius:16px;">
                    <div style="font-size:48px;">${config.icon}</div>
                    <div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:8px;" id="simStatus">${config.status}</div>
                </div>
            </div>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">
                ${config.params.map(p => `
                    <div style="text-align:center;">
                        <div class="sim-label">${p.label}</div>
                        <input type="range" class="sim-slider" id="param_${p.id}" min="${p.min}" max="${p.max}" value="${p.value}" style="width:120px;">
                        <div class="sim-value" id="val_${p.id}">${p.value}${p.unit||''}</div>
                    </div>
                `).join('')}
            </div>
            <div class="sim-controls" style="justify-content:center;">
                <button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 运行</button>
                <button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button>
            </div>
            <div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">
                📊 ${config.logInit}
            </div>
        `;
        const result = wrap(`${courseTitle} — ${lessonTopic}`, html);
        return {
            html: result,
            init: function(container) {
                const status = container.querySelector('#simStatus');
                const log = container.querySelector('#simLog');
                
                config.params.forEach(p => {
                    const slider = container.querySelector(`#param_${p.id}`);
                    const val = container.querySelector(`#val_${p.id}`);
                    slider.addEventListener('input', function() {
                        val.textContent = this.value + (p.unit||'');
                    });
                });

                container.querySelector('#runSimBtn').addEventListener('click', function() {
                    const values = {};
                    config.params.forEach(p => {
                        values[p.id] = container.querySelector(`#param_${p.id}`).value;
                    });
                    status.textContent = config.runningStatus;
                    const t = new Date().toLocaleTimeString();
                    log.innerHTML += `<div>⏱ ${t} → ${config.runLog(values)}</div>`;
                    log.scrollTop = log.scrollHeight;
                    toast('✅ 运行成功！');
                });

                container.querySelector('#resetSimBtn').addEventListener('click', function() {
                    status.textContent = config.status;
                    config.params.forEach(p => {
                        container.querySelector(`#param_${p.id}`).value = p.value;
                        container.querySelector(`#val_${p.id}`).textContent = p.value + (p.unit||'');
                    });
                    log.innerHTML = `📊 ${config.logInit}`;
                    toast('🔄 已重置');
                });
            }
        };
    }

    // R05: 机器人编程与AI感知
    registry['5-1'] = () => createGenericSim('R05','机器人编程与AI感知',1,'系统架构师',{
        desc:'设计机器人系统架构，绘制数据流图',icon:'🏗️',status:'架构设计就绪',
        params:[{id:'sensors',label:'传感器数量',min:1,max:8,value:4,unit:'个'},{id:'actuators',label:'执行器数量',min:1,max:6,value:3,unit:'个'}],
        logInit:'系统架构设计工具就绪...',runningStatus:'架构生成中...',
        runLog:v=>`✅ 生成架构图: ${v.sensors}个传感器 → 控制器 → ${v.actuators}个执行器`
    });
    registry['5-2'] = () => createGenericSim('R05','机器人编程与AI感知',2,'Python编程师',{
        desc:'用Python编写硬件控制程序',icon:'🐍',status:'Python环境就绪',
        params:[{id:'freq',label:'LED频率',min:1,max:10,value:2,unit:'Hz'},{id:'speed',label:'马达速度',min:0,max:100,value:50,unit:'%'}],
        logInit:'Python编程环境就绪...',runningStatus:'代码执行中...',
        runLog:v=>`✅ 执行: LED闪烁${v.freq}Hz, 马达速度${v.speed}%`
    });
    registry['5-3'] = () => createGenericSim('R05','机器人编程与AI感知',3,'数据采集师',{
        desc:'读取传感器数据并实时显示',icon:'📊',status:'传感器待机',
        params:[{id:'dist',label:'超声波距离',min:0,max:200,value:50,unit:'cm'},{id:'temp',label:'温度',min:0,max:50,value:25,unit:'°C'}],
        logInit:'数据采集系统就绪...',runningStatus:'数据采集中...',
        runLog:v=>`✅ 采集: 距离${v.dist}cm, 温度${v.temp}°C`
    });
    registry['5-4'] = () => createGenericSim('R05','机器人编程与AI感知',4,'AI融合工程师',{
        desc:'集成AI视觉模块完成物体识别',icon:'👁️',status:'AI模块待机',
        params:[{id:'classes',label:'识别类别',min:1,max:10,value:5,unit:'类'},{id:'conf',label:'置信度阈值',min:50,max:99,value:80,unit:'%'}],
        logInit:'AI视觉模块就绪...',runningStatus:'识别中...',
        runLog:v=>`✅ 识别${v.classes}类物体, 置信度>${v.conf}%`
    });

    // R06: 仿生机器人创意工坊
    registry['6-1'] = () => createGenericSim('R06','仿生机器人创意工坊',1,'仿生设计师',{
        desc:'分析生物运动结构，设计仿生方案',icon:'🦎',status:'仿生设计就绪',
        params:[{id:'legs',label:'腿数量',min:2,max:8,value:6,unit:'条'},{id:'speed',label:'步频',min:1,max:10,value:4,unit:'Hz'}],
        logInit:'仿生设计工具就绪...',runningStatus:'方案生成中...',
        runLog:v=>`✅ 仿生方案: ${v.legs}足机器人, 步频${v.speed}Hz`
    });
    registry['6-2'] = () => createGenericSim('R06','仿生机器人创意工坊',2,'六足机器人工程师',{
        desc:'控制舵机实现六足行走',icon:'🕷️',status:'六足机器人待机',
        params:[{id:'gait',label:'步态模式',min:1,max:3,value:1,unit:''},{id:'height',label:'身体高度',min:20,max:80,value:50,unit:'mm'}],
        logInit:'六足控制系统就绪...',runningStatus:'行走中...',
        runLog:v=>`✅ 步态${v.gait}, 高度${v.height}mm, 稳定行走`
    });
    registry['6-3'] = () => createGenericSim('R06','仿生机器人创意工坊',3,'仿生鱼设计师',{
        desc:'设计仿生鱼尾实现水中推进',icon:'🐟',status:'仿生鱼待机',
        params:[{id:'freq',label:'摆尾频率',min:1,max:5,value:2,unit:'Hz'},{id:'amp',label:'摆尾幅度',min:10,max:90,value:45,unit:'°'}],
        logInit:'仿生鱼推进系统就绪...',runningStatus:'游动中...',
        runLog:v=>`✅ 摆尾${v.freq}Hz, 幅度${v.amp}°, 推进速度正常`
    });
    registry['6-4'] = () => createGenericSim('R06','仿生机器人创意工坊',4,'创意发明家',{
        desc:'综合所学设计原创仿生机器人',icon:'💡',status:'创意工坊就绪',
        params:[{id:'type',label:'仿生类型',min:1,max:4,value:1,unit:''},{id:'complexity',label:'复杂度',min:1,max:10,value:5,unit:''}],
        logInit:'创意发明工坊就绪...',runningStatus:'设计中...',
        runLog:v=>`✅ 原创仿生机器人: 类型${v.type}, 复杂度${v.complexity}`
    });

    // R07: 智能家居机器人
    registry['7-1'] = () => createGenericSim('R07','智能家居机器人',1,'系统规划师',{
        desc:'设计智能家居系统方案',icon:'🏠',status:'方案设计就绪',
        params:[{id:'rooms',label:'房间数',min:1,max:6,value:3,unit:'间'},{id:'devices',label:'设备数',min:1,max:20,value:8,unit:'个'}],
        logInit:'智能家居设计工具就绪...',runningStatus:'方案生成中...',
        runLog:v=>`✅ 方案: ${v.rooms}个房间, ${v.devices}个智能设备`
    });
    registry['7-2'] = () => createGenericSim('R07','智能家居机器人',2,'环境监测师',{
        desc:'搭建多传感器环境监测系统',icon:'🌡️',status:'传感器待机',
        params:[{id:'temp',label:'温度',min:10,max:40,value:25,unit:'°C'},{id:'humid',label:'湿度',min:20,max:90,value:60,unit:'%'},{id:'light',label:'光照',min:0,max:1000,value:500,unit:'lux'}],
        logInit:'环境监测系统就绪...',runningStatus:'数据采集中...',
        runLog:v=>`✅ 环境: ${v.temp}°C, 湿度${v.humid}%, 光照${v.light}lux`
    });
    registry['7-3'] = () => createGenericSim('R07','智能家居机器人',3,'语音交互设计师',{
        desc:'实现语音控制与反馈功能',icon:'🎤',status:'语音系统待机',
        params:[{id:'cmds',label:'指令数',min:1,max:10,value:5,unit:'条'},{id:'vol',label:'音量',min:0,max:100,value:70,unit:'%'}],
        logInit:'语音交互系统就绪...',runningStatus:'语音识别中...',
        runLog:v=>`✅ 识别${v.cmds}条指令, 音量${v.vol}%`
    });
    registry['7-4'] = () => createGenericSim('R07','智能家居机器人',4,'安防系统工程师',{
        desc:'设计安防逻辑并完成系统联调',icon:'🔒',status:'安防系统待机',
        params:[{id:'zones',label:'防区数',min:1,max:8,value:4,unit:'个'},{id:'sensitivity',label:'灵敏度',min:1,max:10,value:7,unit:''}],
        logInit:'安防系统就绪...',runningStatus:'安防检测中...',
        runLog:v=>`✅ ${v.zones}个防区, 灵敏度${v.sensitivity}, 系统正常`
    });

    // R08: 竞技机器人
    registry['8-1'] = () => createGenericSim('R08','竞技机器人',1,'循迹算法师',{
        desc:'实现PID循迹控制算法',icon:'🏁',status:'循迹系统待机',
        params:[{id:'kp',label:'Kp参数',min:1,max:20,value:10,unit:''},{id:'kd',label:'Kd参数',min:1,max:20,value:5,unit:''},{id:'speed',label:'速度',min:10,max:100,value:60,unit:'%'}],
        logInit:'PID循迹系统就绪...',runningStatus:'循迹中...',
        runLog:v=>`✅ PID: Kp=${v.kp}, Kd=${v.d}, 速度${v.speed}%, 稳定循迹`
    });
    registry['8-2'] = () => createGenericSim('R08','竞技机器人',2,'避障算法师',{
        desc:'多传感器融合避障算法',icon:'🚧',status:'避障系统待机',
        params:[{id:'range',label:'检测距离',min:10,max:100,value:30,unit:'cm'},{id:'strategy',label:'策略',min:1,max:3,value:1,unit:''}],
        logInit:'避障系统就绪...',runningStatus:'避障中...',
        runLog:v=>`✅ 检测距离${v.range}cm, 策略${v.strategy}, 成功避障`
    });
    registry['8-3'] = () => createGenericSim('R08','竞技机器人',3,'竞赛策略师',{
        desc:'设计竞赛对抗策略',icon:'📋',status:'策略设计就绪',
        params:[{id:'attack',label:'攻击性',min:1,max:10,value:5,unit:''},{id:'defense',label:'防御性',min:1,max:10,value:5,unit:''}],
        logInit:'策略设计工具就绪...',runningStatus:'策略生成中...',
        runLog:v=>`✅ 策略: 攻击${v.attack}, 防御${v.defense}`
    });
    registry['8-4'] = () => createGenericSim('R08','竞技机器人',4,'竞赛选手',{
        desc:'综合实战模拟竞赛',icon:'🏆',status:'竞赛就绪',
        params:[{id:'laps',label:'圈数',min:1,max:5,value:3,unit:'圈'},{id:'obstacles',label:'障碍数',min:0,max:10,value:5,unit:'个'}],
        logInit:'竞赛系统就绪...',runningStatus:'竞赛中...',
        runLog:v=>`✅ ${v.laps}圈, ${v.obstacles}个障碍, 竞赛完成！`
    });

    // R09: 机器人底层开发与AI核心
    registry['9-1'] = () => createGenericSim('R09','机器人底层开发与AI核心',1,'ROS系统工程师',{
        desc:'掌握ROS节点通信与架构',icon:'🔗',status:'ROS系统就绪',
        params:[{id:'nodes',label:'节点数',min:2,max:10,value:3,unit:'个'},{id:'rate',label:'通信频率',min:10,max:100,value:50,unit:'Hz'}],
        logInit:'ROS系统就绪...',runningStatus:'节点通信中...',
        runLog:v=>`✅ ${v.nodes}个节点, 频率${v.rate}Hz, 通信正常`
    });
    registry['9-2'] = () => createGenericSim('R09','机器人底层开发与AI核心',2,'SLAM建图师',{
        desc:'激光雷达SLAM建图',icon:'🗺️',status:'SLAM待机',
        params:[{id:'resolution',label:'分辨率',min:1,max:10,value:5,unit:'cm'},{id:'area',label:'建图面积',min:10,max:100,value:30,unit:'m²'}],
        logInit:'SLAM系统就绪...',runningStatus:'建图中...',
        runLog:v=>`✅ 分辨率${v.resolution}cm, 面积${v.area}m², 建图完成`
    });
    registry['9-3'] = () => createGenericSim('R09','机器人底层开发与AI核心',3,'深度学习工程师',{
        desc:'部署YOLO模型实时目标检测',icon:'🧠',status:'YOLO待机',
        params:[{id:'model',label:'模型版本',min:3,max:8,value:5,unit:''},{id:'fps',label:'帧率',min:10,max:60,value:30,unit:'fps'}],
        logInit:'YOLO模型就绪...',runningStatus:'检测中...',
        runLog:v=>`✅ YOLOv${v.model}, ${v.fps}fps, 实时检测正常`
    });
    registry['9-4'] = () => createGenericSim('R09','机器人底层开发与AI核心',4,'自主导航专家',{
        desc:'综合SLAM+目标检测完成自主导航',icon:'🧭',status:'导航系统待机',
        params:[{id:'waypoints',label:'路径点数',min:2,max:10,value:5,unit:'个'},{id:'avoid',label:'避障距离',min:10,max:50,value:20,unit:'cm'}],
        logInit:'自主导航系统就绪...',runningStatus:'导航中...',
        runLog:v=>`✅ ${v.waypoints}个路径点, 避障${v.avoid}cm, 导航完成`
    });

    // R10: 人形机器人开发
    registry['10-1'] = () => createGenericSim('R10','人形机器人开发',1,'运动学分析师',{
        desc:'正向/逆向运动学计算',icon:'📐',status:'运动学计算就绪',
        params:[{id:'joint1',label:'关节1角度',min:0,max:180,value:45,unit:'°'},{id:'joint2',label:'关节2角度',min:0,max:180,value:90,unit:'°'}],
        logInit:'运动学计算工具就绪...',runningStatus:'计算中...',
        runLog:v=>`✅ 关节1=${v.joint1}°, 关节2=${v.joint2}°, 末端位置已计算`
    });
    registry['10-2'] = () => createGenericSim('R10','人形机器人开发',2,'步态规划师',{
        desc:'双足行走步态规划',icon:'🚶',status:'步态规划就绪',
        params:[{id:'stepLen',label:'步长',min:10,max:50,value:30,unit:'cm'},{id:'cadence',label:'步频',min:1,max:5,value:2,unit:'Hz'}],
        logInit:'步态规划系统就绪...',runningStatus:'行走中...',
        runLog:v=>`✅ 步长${v.stepLen}cm, 步频${v.cadence}Hz, 稳定行走`
    });
    registry['10-3'] = () => createGenericSim('R10','人形机器人开发',3,'手势识别工程师',{
        desc:'手势识别控制机器人动作',icon:'✋',status:'手势识别待机',
        params:[{id:'gestures',label:'手势数',min:1,max:10,value:5,unit:'种'},{id:'accuracy',label:'准确率',min:50,max:99,value:85,unit:'%'}],
        logInit:'手势识别系统就绪...',runningStatus:'识别中...',
        runLog:v=>`✅ ${v.gestures}种手势, 准确率${v.accuracy}%`
    });
    registry['10-4'] = () => createGenericSim('R10','人形机器人开发',4,'表演导演',{
        desc:'综合创作人形机器人表演',icon:'🎭',status:'表演系统就绪',
        params:[{id:'moves',label:'动作数',min:1,max:20,value:8,unit:'个'},{id:'duration',label:'时长',min:10,max:120,value:60,unit:'秒'}],
        logInit:'表演编排系统就绪...',runningStatus:'表演中...',
        runLog:v=>`✅ ${v.moves}个动作, 时长${v.duration}秒, 表演完成！`
    });

    // R11: 无人机与空中机器人
    registry['11-1'] = () => createGenericSim('R11','无人机与空中机器人',1,'飞行原理师',{
        desc:'四旋翼飞行原理与仿真',icon:'🚁',status:'仿真就绪',
        params:[{id:'throttle',label:'油门',min:0,max:100,value:50,unit:'%'},{id:'yaw',label:'偏航角',min:-180,max:180,value:0,unit:'°'}],
        logInit:'飞行仿真就绪...',runningStatus:'飞行中...',
        runLog:v=>`✅ 油门${v.throttle}%, 偏航${v.yaw}°, 稳定悬停`
    });
    registry['11-2'] = () => createGenericSim('R11','无人机与空中机器人',2,'飞控编程师',{
        desc:'Python控制无人机飞行',icon:'🐍',status:'飞控就绪',
        params:[{id:'alt',label:'高度',min:1,max:50,value:10,unit:'m'},{id:'speed',label:'速度',min:1,max:10,value:5,unit:'m/s'}],
        logInit:'飞控系统就绪...',runningStatus:'飞行中...',
        runLog:v=>`✅ 高度${v.alt}m, 速度${v.speed}m/s, 航线正常`
    });
    registry['11-3'] = () => createGenericSim('R11','无人机与空中机器人',3,'AI航拍分析师',{
        desc:'AI航拍与实时图像分析',icon:'📸',status:'航拍待机',
        params:[{id:'objects',label:'检测目标',min:1,max:10,value:3,unit:'类'},{id:'altitude',label:'航拍高度',min:5,max:100,value:30,unit:'m'}],
        logInit:'AI航拍系统就绪...',runningStatus:'航拍分析中...',
        runLog:v=>`✅ 高度${v.altitude}m, 检测${v.objects}类目标`
    });
    registry['11-4'] = () => createGenericSim('R11','无人机与空中机器人',4,'搜救任务指挥官',{
        desc:'自主搜索定位目标',icon:'🆘',status:'搜救就绪',
        params:[{id:'area',label:'搜索面积',min:100,max:10000,value:1000,unit:'m²'},{id:'targets',label:'目标数',min:1,max:5,value:2,unit:'个'}],
        logInit:'搜救系统就绪...',runningStatus:'搜索中...',
        runLog:v=>`✅ 面积${v.area}m², 发现${v.targets}个目标, 搜救完成！`
    });

    // R12: AI机器人竞赛特训
    registry['12-1'] = () => createGenericSim('R12','AI机器人竞赛特训',1,'竞赛设计师',{
        desc:'竞赛级机器人设计方案',icon:'📐',status:'设计就绪',
        params:[{id:'weight',label:'重量限制',min:500,max:5000,value:2000,unit:'g'},{id:'size',label:'尺寸',min:10,max:50,value:25,unit:'cm'}],
        logInit:'竞赛设计工具就绪...',runningStatus:'设计中...',
        runLog:v=>`✅ 重量${v.weight}g, 尺寸${v.size}cm, 方案合规`
    });
    registry['12-2'] = () => createGenericSim('R12','AI机器人竞赛特训',2,'路径规划算法师',{
        desc:'A*/Dijkstra路径规划',icon:'🗺️',status:'算法就绪',
        params:[{id:'algo',label:'算法',min:1,max:2,value:1,unit:''},{id:'gridSize',label:'网格大小',min:5,max:20,value:10,unit:''}],
        logInit:'路径规划算法就绪...',runningStatus:'规划中...',
        runLog:v=>`✅ 算法${v.algo===1?'A*':'Dijkstra'}, 网格${v.gridSize}×${v.gridSize}, 路径最优`
    });
    registry['12-3'] = () => createGenericSim('R12','AI机器人竞赛特训',3,'多机协同工程师',{
        desc:'多机协同通信与群体智能',icon:'🤝',status:'协同系统就绪',
        params:[{id:'robots',label:'机器人数量',min:2,max:10,value:3,unit:'台'},{id:'protocol',label:'通信协议',min:1,max:3,value:1,unit:''}],
        logInit:'多机协同系统就绪...',runningStatus:'协同中...',
        runLog:v=>`✅ ${v.robots}台机器人, 协议${v.protocol}, 协同正常`
    });
    registry['12-4'] = () => createGenericSim('R12','AI机器人竞赛特训',4,'竞赛冠军',{
        desc:'综合实战模拟竞赛',icon:'🏆',status:'竞赛就绪',
        params:[{id:'tasks',label:'任务数',min:1,max:10,value:5,unit:'个'},{id:'time',label:'限时',min:60,max:600,value:300,unit:'秒'}],
        logInit:'竞赛系统就绪...',runningStatus:'竞赛中...',
        runLog:v=>`✅ ${v.tasks}个任务, 限时${v.time}秒, 竞赛完成！🏆`
    });

    // ============================================================
    //  辅助：获取模拟器
    // ============================================================

    function get(courseId, lessonNum) {
        const key = courseId + '-' + lessonNum;
        if (registry[key]) {
            return registry[key]();
        }
        return null;
    }

    function getAllKeys() {
        return Object.keys(registry);
    }

    return {
        get: get,
        getAllKeys: getAllKeys
    };

})();
