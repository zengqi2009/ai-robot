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
                @keyframes cwFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
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
    //  R01: 机器人初探与感知世界（5-8岁）
    //  每节课设计为完整的线上教学流程：
    //    场景引入 → 知识探索 → 动手实验 → 闯关挑战 → 课堂小结
    // ============================================================

    // ---------- 共用辅助组件 ----------
    function sectionTitle(icon, title, desc) {
        return `<div style="text-align:center;margin-bottom:16px;">
            <div style="font-size:40px;margin-bottom:4px;">${icon}</div>
            <div style="font-size:18px;font-weight:700;color:#1a2a6c;font-family:'Noto Serif SC',serif;">${title}</div>
            ${desc ? `<div style="font-size:13px;color:#7a6a5a;margin-top:4px;">${desc}</div>` : ''}
        </div>`;
    }

    function starBadge(count, total) {
        let s = '';
        for (let i=0;i<total;i++) s += i<count ? '⭐' : '☆';
        return `<span style="font-size:20px;letter-spacing:2px;">${s}</span>`;
    }

    function celebrationHTML(title, msg, emoji) {
        return `<div style="text-align:center;padding:30px 20px;animation:cwFadeIn .5s;">
            <div style="font-size:72px;animation:simFloat 1.5s ease-in-out infinite;">${emoji||'🎉'}</div>
            <div style="font-size:22px;font-weight:800;color:#1a2a6c;margin:12px 0;font-family:'Noto Serif SC',serif;">${title}</div>
            <div style="font-size:15px;color:#4a3a2a;">${msg}</div>
        </div>`;
    }

    // ============================================================
    //  第1课：认识机器人朋友 — 6页线上课件（场景引入→知识探索→动手实验→闯关挑战→课堂小结）
    // ============================================================
    registry['1-1'] = function() {
        const parts = [
            { icon:'🧱', name:'结构积木', category:'结构', desc:'搭建机器人身体骨架的基础零件，就像机器人的"骨头"。有不同形状和大小的积木块。', element:'行动', color:'#e67e22' },
            { icon:'⚡', name:'马达', category:'动力', desc:'让机器人动起来的"肌肉"！通电后转动，输出动力。可以控制速度和方向。', element:'行动', color:'#e74c3c' },
            { icon:'🔄', name:'轮子', category:'移动', desc:'装在马达轴上，带着机器人满地跑。大轮子跑得快，小轮子更灵活。', element:'行动', color:'#3498db' },
            { icon:'👁️', name:'颜色传感器', category:'感知', desc:'机器人的"眼睛"！能识别红、绿、蓝、黄等颜色，让机器人看懂世界。', element:'感知', color:'#2ecc71' },
            { icon:'🧠', name:'控制器', category:'核心', desc:'机器人的"大脑"！接收传感器信号，思考后发出命令，是整台机器人的指挥官。', element:'思考', color:'#9b59b6' },
            { icon:'🔗', name:'连接线', category:'连接', desc:'连接控制器和各部件的"神经"，传递电信号，让信息在机器人身体里流动。', element:'思考', color:'#1abc9c' }
        ];

        let currentPage = 0;
        const totalPages = 6;
        const pageTitles = ['📖 场景引入','🧠 三要素学习','🔍 零件探索（上）','🔍 零件探索（下）','🏆 知识闯关','🎉 课堂小结'];
        let exploreDone = [false,false,false,false,false,false];
        let challengeScore = 0, challengeRound = 0, challengeQ = null, cqActive = false;
        let usedQuestions = [];

        const questionBank = [
            { q:'机器人的"大脑"是什么？', opts:['马达','控制器','轮子','传感器'], ans:1, emoji:'🧠', hint:'它负责处理和判断信息' },
            { q:'哪个零件让机器人"看到"颜色？', opts:['马达','控制器','颜色传感器','连接线'], ans:2, emoji:'👁️', hint:'它是机器人的"眼睛"' },
            { q:'机器人的"肌肉"是什么？', opts:['结构积木','控制器','连接线','马达'], ans:3, emoji:'⚡', hint:'它提供动力让机器人动起来' },
            { q:'感知→思考→行动中，"感知"靠什么？', opts:['马达','传感器','轮子','积木'], ans:1, emoji:'👁️', hint:'它像眼睛耳朵一样收集信息' },
            { q:'连接控制器和马达的是什么？', opts:['积木','轮子','连接线','传感器'], ans:2, emoji:'🔗', hint:'它像神经一样传递信号' },
            { q:'机器人身体的"骨头"是什么？', opts:['结构积木','马达','控制器','传感器'], ans:0, emoji:'🧱', hint:'它搭建起机器人的骨架' },
            { q:'哪个不是"行动"要素？', opts:['马达转动','轮子前进','传感器检测','机械臂抓取'], ans:2, emoji:'🤔', hint:'行动=执行动作，那检测呢？' },
            { q:'机器人三要素的正确顺序？', opts:['行动→思考→感知','感知→思考→行动','思考→感知→行动','感知→行动→思考'], ans:1, emoji:'🔄', hint:'先看到，再想，最后动' }
        ];

        function shuffleQ() {
            if (usedQuestions.length >= questionBank.length) usedQuestions = [];
            const available = questionBank.filter((_,i) => !usedQuestions.includes(i));
            const idx = Math.floor(Math.random() * available.length);
            const realIdx = questionBank.indexOf(available[idx]);
            usedQuestions.push(realIdx);
            return questionBank[realIdx];
        }

        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                const label = i<currentPage?'✓':(i+1);
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${label}</span>`;
            }
            return `
                <div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div>
                <div class="cw-dots-row">${dots}</div>
                <div class="cw-page-label">${pageTitles[currentPage]}</div>
            `;
        }

        function renderPageContent(n) {
            switch(n) {
                // ============ 第1页：场景引入 ============
                case 0: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🤖','欢迎来到机器人世界！','和机器人小R做朋友，一起探索机器人的奥秘')}
                        <div style="text-align:center;margin:12px 0;">
                            <div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;">
                                <div style="width:100px;height:110px;background:linear-gradient(135deg,#4a90d9,#67b8de);border-radius:30px;margin:0 auto;position:relative;box-shadow:0 8px 24px rgba(74,144,217,.3);">
                                    <div style="width:36px;height:32px;background:#fff;border-radius:50%;position:absolute;top:16px;left:50%;transform:translateX(-50%);">
                                        <div style="display:flex;gap:8px;justify-content:center;padding-top:10px;">
                                            <div style="width:7px;height:7px;background:#1a2a6c;border-radius:50%;"></div>
                                            <div style="width:7px;height:7px;background:#1a2a6c;border-radius:50%;"></div>
                                        </div>
                                    </div>
                                    <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:20px;height:6px;border-bottom:3px solid #fff;border-radius:0 0 10px 10px;"></div>
                                </div>
                                <div style="font-size:13px;font-weight:700;color:#1a2a6c;margin-top:8px;">小R 🤖</div>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;">
                            <p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">
                                👋 大家好！我是<strong style="color:#1a2a6c;">机器人小R</strong>！<br>
                                我会🏃 <strong>走路</strong>、👀 <strong>看到东西</strong>、🧠 <strong>思考问题</strong>！<br>
                                想知道我是怎么做到的吗？<br>
                                让我们一起来<strong style="color:#e67e22;">认识机器人朋友</strong>吧！
                            </p>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.6;">
                                你觉得机器人<strong>需要哪些"器官"</strong>才能像人一样工作？<br>
                                💡 提示：人用眼睛看，用大脑想，用手脚行动——
                            </div>
                        </div>
                    </div>`;
                // ============ 第2页：三要素学习 ============
                case 1: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🧠','机器人三要素','感知→思考→行动：机器人工作的秘密公式')}
                        <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0;padding:12px;background:linear-gradient(90deg,#e8f0fe,#f8f6f0,#fdebd0);border-radius:20px;">
                            <div class="cw-element-card" style="--ec:#2ecc71">
                                <div style="font-size:36px;">👁️</div>
                                <div style="font-size:16px;font-weight:800;color:#1a6e3a;">感知</div>
                                <div style="font-size:11px;color:#4a3a2a;">用传感器<br>收集信息</div>
                            </div>
                            <div style="font-size:28px;color:#1a2a6c;font-weight:900;">→</div>
                            <div class="cw-element-card" style="--ec:#9b59b6">
                                <div style="font-size:36px;">🧠</div>
                                <div style="font-size:16px;font-weight:800;color:#6c3483;">思考</div>
                                <div style="font-size:11px;color:#4a3a2a;">用控制器<br>判断决策</div>
                            </div>
                            <div style="font-size:28px;color:#1a2a6c;font-weight:900;">→</div>
                            <div class="cw-element-card" style="--ec:#e74c3c">
                                <div style="font-size:36px;">⚡</div>
                                <div style="font-size:16px;font-weight:800;color:#922b21;">行动</div>
                                <div style="font-size:11px;color:#4a3a2a;">用马达<br>执行动作</div>
                            </div>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:10px;">🌰 举个例子：机器人过马路</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.8;">
                                👁️ <strong style="color:#2ecc71;">感知</strong>：颜色传感器"看到"红灯亮起<br>
                                🧠 <strong style="color:#9b59b6;">思考</strong>：控制器判断"红灯=停止"<br>
                                ⚡ <strong style="color:#e74c3c;">行动</strong>：马达停止转动，小车停下来
                            </div>
                        </div>
                        <div style="text-align:center;padding:10px;background:#f0ede4;border-radius:12px;font-size:12px;color:#7a6a5a;">
                            💡 <strong>记住公式：感知→思考→行动</strong>，这就是机器人工作的秘密！
                        </div>
                    </div>`;
                // ============ 第3页：零件探索（上）— 行动要素 ============
                case 2: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🔍','零件探索（上）','认识让机器人"动起来"的零件——行动要素')}
                        <div style="display:flex;justify-content:center;margin-bottom:12px;">
                            <div class="r01-robot-full" id="robotCharP3">
                                <div class="r01-robot-head" id="rHeadP3"><div class="r01-robot-eye r01-robot-eye-l"></div><div class="r01-robot-eye r01-robot-eye-r"></div><div class="r01-robot-mouth"></div></div>
                                <div class="r01-robot-body" id="rBodyP3"><div class="r01-robot-arm r01-robot-arm-l"></div><div class="r01-robot-arm r01-robot-arm-r"></div><div class="r01-robot-leg r01-robot-leg-l"></div><div class="r01-robot-leg r01-robot-leg-r"></div></div>
                            </div>
                        </div>
                        <div class="r01-part-grid" style="grid-template-columns:repeat(3,1fr);">
                            ${parts.slice(0,3).map((p,i) => `
                                <div class="r01-part-card" data-p3="${i}">
                                    <span class="element-tag" style="background:${p.color}">${p.element}</span>
                                    <span class="icon">${p.icon}</span>
                                    <span class="name">${p.name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="r01-info-panel" id="partInfoP3">
                            <span style="font-size:28px;">👆</span><br>
                            <span style="font-size:14px;color:#7a6a5a;">点击上方零件卡片，了解每个零件的功能</span>
                        </div>
                        <div style="text-align:center;margin-top:10px;font-size:12px;color:#e74c3c;font-weight:700;">⚡ 这3个零件都属于「行动」要素</div>
                    </div>`;
                // ============ 第4页：零件探索（下）— 感知+思考要素 ============
                case 3: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🔍','零件探索（下）','认识机器人的"眼睛"和"大脑"——感知与思考要素')}
                        <div style="display:flex;justify-content:center;margin-bottom:12px;">
                            <div class="r01-robot-full" id="robotCharP4">
                                <div class="r01-robot-head" id="rHeadP4"><div class="r01-robot-eye r01-robot-eye-l"></div><div class="r01-robot-eye r01-robot-eye-r"></div><div class="r01-robot-mouth"></div></div>
                                <div class="r01-robot-body" id="rBodyP4"><div class="r01-robot-arm r01-robot-arm-l"></div><div class="r01-robot-arm r01-robot-arm-r"></div><div class="r01-robot-leg r01-robot-leg-l"></div><div class="r01-robot-leg r01-robot-leg-r"></div></div>
                            </div>
                        </div>
                        <div class="r01-part-grid" style="grid-template-columns:repeat(3,1fr);">
                            ${parts.slice(3,6).map((p,i) => `
                                <div class="r01-part-card" data-p4="${i}">
                                    <span class="element-tag" style="background:${p.color}">${p.element}</span>
                                    <span class="icon">${p.icon}</span>
                                    <span class="name">${p.name}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="r01-info-panel" id="partInfoP4">
                            <span style="font-size:28px;">👆</span><br>
                            <span style="font-size:14px;color:#7a6a5a;">点击上方零件卡片，了解每个零件的功能</span>
                        </div>
                        <div style="text-align:center;margin-top:10px;display:flex;gap:8px;justify-content:center;">
                            <span style="font-size:12px;color:#2ecc71;font-weight:700;">👁️ 感知</span>
                            <span style="font-size:12px;color:#d0c4b4;">|</span>
                            <span style="font-size:12px;color:#9b59b6;font-weight:700;">🧠 思考</span>
                        </div>
                    </div>`;
                // ============ 第5页：知识闯关 ============
                case 4: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🏆','知识大闯关','检验你对机器人零件和三要素的了解！')}
                        <div class="r01-challenge-card">
                            <div style="font-size:60px;margin-bottom:8px;" id="cqEmoji">🎯</div>
                            <div style="font-size:16px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="cqQuestion">准备开始挑战！</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="cqOptions"></div>
                            <div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="cqFeedback"></div>
                        </div>
                        <div style="display:flex;gap:16px;justify-content:center;margin-top:12px;">
                            <span style="font-size:14px;font-weight:600;">⭐ 得分：<span style="font-size:20px;color:#1a2a6c;" id="cqScore">0</span></span>
                            <span style="font-size:14px;font-weight:600;">📝 第<span style="font-size:20px;color:#1a2a6c;" id="cqRound">1</span>/6 题</span>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="cqStartBtn">🎮 开始闯关</button>
                            <button class="sim-btn sim-btn-outline" id="cqResetBtn">🔄 重新来</button>
                        </div>
                    </div>`;
                // ============ 第6页：课堂小结 ============
                case 5: return `
                    <div class="cw-page-inner">
                        ${celebrationHTML('太棒了！','你完成了第一课的学习！','🎉')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:2;">
                                ✅ 机器人的<strong>三要素</strong>：感知→思考→行动<br>
                                ✅ 认识了<strong>6大核心零件</strong>及其功能<br>
                                ✅ 理解了传感器、控制器、马达的<strong>分工</strong><br>
                                ✅ 知道了结构积木是<strong>骨架</strong>，连接线是<strong>神经</strong><br>
                                ✅ 能够准确说出每个零件属于哪个<strong>要素</strong>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;">
                            <div style="font-size:28px;margin-bottom:4px;">🌟</div>
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div>
                            <div style="font-size:13px;color:#4a3a2a;">我们要<strong>搭建自己的第一台机器人小车</strong>！🔧🚗</div>
                        </div>
                    </div>`;
                default: return '';
            }
        }

        function buildHTML() {
            return `
                <style>
                    .cw-progress { height:5px; background:#e8e0d5; border-radius:10px; overflow:hidden; margin-bottom:12px; }
                    .cw-progress-fill { height:100%; background:linear-gradient(90deg,#4a90d9,#1a2a6c); border-radius:10px; transition:width .4s ease; }
                    .cw-dots-row { display:flex; gap:8px; justify-content:center; margin-bottom:6px; }
                    .cw-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a; }
                    .cw-dot.active { background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3); }
                    .cw-dot.done { background:#5cb85c;color:#fff;border-color:#5cb85c; }
                    .cw-dot:hover:not(.active) { border-color:#4a90d9; }
                    .cw-page-label { text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px; }
                    @keyframes cwFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                    .cw-page-inner { animation:cwFadeIn .35s ease-out; }
                    .cw-nav-bottom { display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px; }
                    .cw-nav-bottom .cw-indicator { font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center; }
                    .cw-nav-bottom button { min-width:90px; }
                    .cw-element-card { background:#fff;border-radius:16px;padding:12px 14px;text-align:center;border:2px solid var(--ec,#e8e0d5);transition:all .2s;min-width:80px;cursor:default; }
                    .cw-element-card:hover { transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.08); }
                    .r01-robot-full { width:120px;height:140px;margin:0 auto;position:relative; }
                    .r01-robot-head { width:50px;height:45px;background:#4a90d9;border-radius:50%;margin:0 auto 4px;position:relative;transition:all .3s; }
                    .r01-robot-eye { width:10px;height:10px;background:#fff;border-radius:50%;position:absolute;top:14px; }
                    .r01-robot-eye::after { content:'';display:block;width:5px;height:5px;background:#1a2a6c;border-radius:50%;margin:2.5px auto; }
                    .r01-robot-eye-l { left:10px; } .r01-robot-eye-r { right:10px; }
                    .r01-robot-mouth { position:absolute;bottom:10px;left:50%;transform:translateX(-50%);width:16px;height:6px;border-bottom:3px solid #fff;border-radius:0 0 8px 8px; }
                    .r01-robot-body { width:60px;height:45px;background:#4a90d9;border-radius:10px;margin:0 auto;position:relative;transition:all .3s; }
                    .r01-robot-arm { width:10px;height:30px;background:#3a7bc8;border-radius:5px;position:absolute;top:8px; }
                    .r01-robot-arm-l { left:-16px; } .r01-robot-arm-r { right:-16px; }
                    .r01-robot-leg { width:10px;height:25px;background:#3a7bc8;border-radius:5px;position:absolute;bottom:-28px; }
                    .r01-robot-leg-l { left:12px; } .r01-robot-leg-r { right:12px; }
                    .r01-part-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
                    .r01-part-card { background:#fff; border-radius:16px; padding:14px 8px; text-align:center; border:3px solid #e8e0d5; cursor:pointer; transition:all .25s; position:relative; }
                    .r01-part-card:hover { transform:translateY(-4px); box-shadow:0 8px 20px rgba(0,0,0,.1); }
                    .r01-part-card.selected { border-color:#1a2a6c; background:#e8f0fe; }
                    .r01-part-card .icon { font-size:36px; display:block; transition:all .2s; }
                    .r01-part-card:hover .icon { transform:scale(1.15); }
                    .r01-part-card .name { font-size:12px; font-weight:700; color:#4a3a2a; margin-top:4px; display:block; }
                    .r01-part-card .element-tag { position:absolute; top:-8px; right:-8px; font-size:10px; padding:2px 8px; border-radius:10px; color:#fff; font-weight:700; }
                    .r01-info-panel { background:linear-gradient(135deg,#f8f6f0,#e8f0fe); border-radius:16px; padding:16px; text-align:center; transition:all .3s; border:2px solid #e8e0d5; min-height:70px; }
                    .r01-challenge-card { background:#fff; border-radius:20px; padding:20px; text-align:center; border:3px solid #e8e0d5; }
                    @media(max-width:768px){
                        .cw-dot{width:24px;height:24px;font-size:11px;}
                        .cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}
                        .r01-part-grid{grid-template-columns:repeat(3,1fr);gap:8px;}
                        .r01-part-card{padding:10px 6px;}
                        .r01-part-card .icon{font-size:28px;}
                        .cw-element-card{min-width:60px;padding:8px 6px;font-size:11px;}
                    }
                    @media(max-width:480px){
                        .cw-dot{width:20px;height:20px;font-size:10px;}
                        .cw-dots-row{gap:5px;}
                        .cw-nav-bottom{gap:6px;flex-wrap:wrap;}
                        .cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}
                        .cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}
                        .r01-part-grid{grid-template-columns:repeat(2,1fr);gap:6px;}
                        .r01-part-card{padding:8px 4px;border-radius:12px;}
                        .r01-part-card .icon{font-size:24px;}
                        .r01-part-card .name{font-size:10px;}
                        .r01-part-card .element-tag{font-size:8px;padding:1px 6px;top:-6px;right:-4px;}
                        .r01-info-panel{padding:10px;font-size:12px;min-height:50px;}
                        .r01-robot-full{width:80px;height:100px;}
                        .r01-robot-head{width:36px;height:32px;}
                        .r01-robot-body{width:44px;height:34px;}
                        .r01-robot-arm{width:7px;height:20px;}
                        .r01-robot-leg{width:7px;height:16px;bottom:-20px;}
                        .r01-robot-arm-l{left:-10px;}.r01-robot-arm-r{right:-10px;}
                        .r01-robot-leg-l{left:8px;}.r01-robot-leg-r{right:8px;}
                        .cw-element-card{min-width:50px;padding:6px 4px;}
                        .r01-challenge-card{padding:14px;}
                        .cw-page-label{font-size:11px;}
                    }
                </style>
                ${renderPageNav()}
                <div class="cw-content" id="cwContent">${renderPageContent(0)}</div>
                <div class="cw-nav-bottom">
                    <button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button>
                    <span class="cw-indicator" id="cwIndicator">1/${totalPages}</span>
                    <button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button>
                </div>
            `;
        }

        const html = buildHTML();
        const result = wrap('认识机器人朋友', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent');
                const cwPrevBtn = container.querySelector('#cwPrevBtn');
                const cwNextBtn = container.querySelector('#cwNextBtn');
                const cwIndicator = container.querySelector('#cwIndicator');
                const navTop = container.querySelector('.cw-dots-row')?.parentElement;

                function updateNavUI() {
                    // Update dots
                    const dots = container.querySelectorAll('.cw-dot');
                    dots.forEach((d,i) => {
                        d.className = 'cw-dot ' + (i===currentPage?'active':(i<currentPage?'done':''));
                        d.textContent = i<currentPage?'✓':(i+1);
                    });
                    // Update progress
                    const bar = container.querySelector('.cw-progress-fill');
                    if (bar) bar.style.width = ((currentPage+1)/totalPages*100)+'%';
                    // Update label
                    const label = container.querySelector('.cw-page-label');
                    if (label) label.textContent = pageTitles[currentPage];
                    // Update buttons
                    cwPrevBtn.disabled = currentPage === 0;
                    if (currentPage >= totalPages-1) {
                        cwNextBtn.textContent = '🎉 完成课程';
                        cwNextBtn.className = 'sim-btn sim-btn-success';
                    } else {
                        cwNextBtn.textContent = '下一页 →';
                        cwNextBtn.className = 'sim-btn sim-btn-primary';
                    }
                    cwIndicator.textContent = (currentPage+1)+'/'+totalPages;
                }

                function goToPage(n) {
                    if (n<0||n>=totalPages) return;
                    // Cleanup previous page events
                    if (currentPage === 4) { cqActive = false; }
                    currentPage = n;
                    cwContent.innerHTML = renderPageContent(n);
                    updateNavUI();
                    bindPageEvents(n);
                    cwContent.scrollIntoView({behavior:'smooth',block:'start'});
                }

                function bindPageEvents(n) {
                    if (n === 2) bindPartsPage('P3', 0, 3);
                    if (n === 3) bindPartsPage('P4', 3, 3);
                    if (n === 4) bindChallengePage();
                }

                function bindPartsPage(suffix, offset, count) {
                    const rHead = container.querySelector('#rHead'+suffix);
                    const rBody = container.querySelector('#rBody'+suffix);
                    const infoPanel = container.querySelector('#partInfo'+suffix);
                    container.querySelectorAll('[data-'+suffix.toLowerCase()+']').forEach(el => {
                        el.addEventListener('click', function() {
                            const idx = parseInt(this.dataset[suffix.toLowerCase()]) + offset;
                            const p = parts[idx];
                            container.querySelectorAll('[data-'+suffix.toLowerCase()+']').forEach(c => c.classList.remove('selected'));
                            this.classList.add('selected');
                            exploreDone[idx] = true;
                            infoPanel.innerHTML = `
                                <div style="font-size:40px;">${p.icon}</div>
                                <div style="font-size:16px;font-weight:800;color:#1a2a6c;">${p.name}</div>
                                <div style="font-size:11px;color:#7a6a5a;">📂 ${p.category} | 三要素：<span style="color:${p.color};font-weight:700;">${p.element}</span></div>
                                <div style="font-size:13px;color:#4a3a2a;margin-top:6px;line-height:1.5;">${p.desc}</div>
                            `;
                            if (rHead) rHead.style.transform = 'rotate(8deg)';
                            if (rBody) rBody.style.background = p.color;
                            setTimeout(() => { if (rHead) rHead.style.transform = 'rotate(0deg)'; }, 400);
                            toast('✅ 认识了：' + p.name);
                        });
                    });
                }

                function bindChallengePage() {
                    const cqEmoji = container.querySelector('#cqEmoji');
                    const cqQuestion = container.querySelector('#cqQuestion');
                    const cqOptions = container.querySelector('#cqOptions');
                    const cqFeedback = container.querySelector('#cqFeedback');
                    const cqScore = container.querySelector('#cqScore');
                    const cqRound = container.querySelector('#cqRound');
                    const cqStartBtn = container.querySelector('#cqStartBtn');
                    const cqResetBtn = container.querySelector('#cqResetBtn');
                    cqActive = false; challengeScore = 0; challengeRound = 0;
                    usedQuestions = [];
                    if (cqScore) cqScore.textContent = '0';
                    if (cqRound) cqRound.textContent = '1';
                    if (cqEmoji) cqEmoji.textContent = '🎯';
                    if (cqQuestion) cqQuestion.textContent = '准备开始挑战！';
                    if (cqOptions) cqOptions.innerHTML = '';
                    if (cqFeedback) cqFeedback.innerHTML = '';
                    if (cqStartBtn) cqStartBtn.textContent = '🎮 开始闯关';

                    function nextCQ() {
                        if (challengeRound >= 6) {
                            if (cqEmoji) cqEmoji.textContent = challengeScore >= 5 ? '🏆' : challengeScore >= 3 ? '😊' : '💪';
                            if (cqQuestion) cqQuestion.textContent = challengeScore >= 5 ? '太厉害了！你是机器人小专家！' : challengeScore >= 3 ? '不错哦！继续加油！' : '再学一下零件知识吧~';
                            if (cqOptions) cqOptions.innerHTML = '';
                            if (cqFeedback) cqFeedback.innerHTML = starBadge(challengeScore, 6) + '<br><span style="font-size:14px;">'+challengeScore+'/6 分</span>';
                            cqActive = false;
                            if (cqStartBtn) cqStartBtn.textContent = '🔄 再来一次';
                            if (challengeScore >= 5) toast('🏆 闯关成功！你是机器人小达人！');
                            return;
                        }
                        challengeQ = shuffleQ();
                        challengeRound++;
                        if (cqEmoji) cqEmoji.textContent = challengeQ.emoji;
                        if (cqQuestion) cqQuestion.textContent = '第'+challengeRound+'题：'+challengeQ.q;
                        if (cqOptions) cqOptions.innerHTML = challengeQ.opts.map((o,i) => '<button class="sim-btn sim-btn-outline" data-opt="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');
                        if (cqFeedback) cqFeedback.innerHTML = '<span style="color:#7a6a5a;">选择一个答案吧~</span>';
                        if (cqRound) cqRound.textContent = challengeRound;
                        cqActive = true;
                        if (cqOptions) {
                            cqOptions.querySelectorAll('[data-opt]').forEach(btn => {
                                btn.addEventListener('click', function() {
                                    if (!cqActive) return;
                                    cqActive = false;
                                    const ans = parseInt(this.dataset.opt);
                                    if (cqOptions) cqOptions.querySelectorAll('[data-opt]').forEach(b => b.disabled = true);
                                    if (ans === challengeQ.ans) {
                                        challengeScore++;
                                        if (cqScore) cqScore.textContent = challengeScore;
                                        if (cqFeedback) cqFeedback.innerHTML = '<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+challengeQ.hint+'</span>';
                                        toast('✅ 答对了！');
                                    } else {
                                        if (cqFeedback) cqFeedback.innerHTML = '<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+challengeQ.opts[challengeQ.ans]+'」。'+challengeQ.hint+'</span>';
                                        toast('❌ 再想想~');
                                    }
                                    setTimeout(nextCQ, 1800);
                                });
                            });
                        }
                    }

                    if (cqStartBtn) {
                        cqStartBtn.onclick = function() {
                            challengeScore = 0; challengeRound = 0; challengeQ = null; usedQuestions = [];
                            if (cqScore) cqScore.textContent = '0';
                            if (cqRound) cqRound.textContent = '1';
                            if (cqFeedback) cqFeedback.innerHTML = '';
                            nextCQ();
                            this.textContent = '⏳ 答题中...';
                        };
                    }
                    if (cqResetBtn) {
                        cqResetBtn.onclick = function() {
                            cqActive = false; challengeScore = 0; challengeRound = 0; usedQuestions = [];
                            if (cqScore) cqScore.textContent = '0';
                            if (cqRound) cqRound.textContent = '1';
                            if (cqEmoji) cqEmoji.textContent = '🎯';
                            if (cqQuestion) cqQuestion.textContent = '准备开始挑战！';
                            if (cqOptions) cqOptions.innerHTML = '';
                            if (cqFeedback) cqFeedback.innerHTML = '';
                            if (cqStartBtn) cqStartBtn.textContent = '🎮 开始闯关';
                            toast('🔄 已重置');
                        };
                    }
                }

                // Navigation buttons
                cwPrevBtn.addEventListener('click', () => { if (currentPage>0) goToPage(currentPage-1); });
                cwNextBtn.addEventListener('click', () => {
                    if (currentPage >= totalPages-1) {
                        toast('🎉 恭喜完成第一课！');
                    } else {
                        goToPage(currentPage+1);
                    }
                });

                // Dot click navigation
                container.querySelectorAll('.cw-dot').forEach(dot => {
                    dot.addEventListener('click', function() {
                        const target = parseInt(this.dataset.goto);
                        if (target <= currentPage || target === currentPage + 1) {
                            goToPage(target);
                        }
                    });
                });

                // Initial page
                updateNavUI();
            }
        };
    };

    // ============================================================
    //  第2课：搭建我的第一台小车 — 5页线上课件
    // ============================================================
    registry['1-2'] = function() {
        const allSteps = [
            { id:'base', text:'安装底盘', icon:'🟫', desc:'选择一块大底盘作为小车的基础平台，底盘要大要稳！', x:95, y:125, w:100, h:18, color:'#8B6914', part:'底盘' },
            { id:'motor', text:'固定马达', icon:'⚡', desc:'把马达用积木固定在底盘后端，这是小车的动力来源。', x:130, y:100, w:32, h:22, color:'#e74c3c', part:'马达' },
            { id:'wheel', text:'安装轮子', icon:'🔄', desc:'将四个轮子套在马达轴和前端轴上，轮子要卡紧哦！', x:60, y:128, w:18, h:18, color:'#333', part:'轮子', count:4 },
            { id:'controller', text:'连接控制器', icon:'🧠', desc:'把控制器放在底盘中央，用连接线连接马达。', x:105, y:108, w:40, h:16, color:'#9b59b6', part:'控制器' },
            { id:'test', text:'通电测试', icon:'🔌', desc:'打开开关，检查马达是否转动、轮子是否滚动！', x:'all', y:'all', color:'#5cb85c', part:'测试' }
        ];

        let currentPage = 0;
        const totalPages = 5;
        const pageTitles = ['📖 场景引入','🔧 认识零件','🏗️ 动手搭建','🏆 搭建挑战','🎉 课堂小结'];
        let buildStep = 0;
        let placedParts = {};
        let challengeScore = 0;

        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${i<currentPage?'✓':(i+1)}</span>`;
            }
            return `
                <div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div>
                <div class="cw-dots-row">${dots}</div>
                <div class="cw-page-label">${pageTitles[currentPage]}</div>
            `;
        }

        function renderPageContent(n) {
            switch(n) {
                case 0: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🚗','搭建我的第一台小车','你准备好了吗？我们要动手造一辆会跑的小车！')}
                        <div style="text-align:center;margin:16px 0;">
                            <div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;">
                                <div style="font-size:80px;">🚗</div>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;">
                            <p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">
                                🔧 一台机器人小车需要<strong style="color:#1a2a6c;">5个关键零件</strong>：<br>
                                🟫 <strong>底盘</strong> — 小车的"身体平台"<br>
                                ⚡ <strong>马达</strong> — 小车的"动力肌肉"<br>
                                🔄 <strong>轮子</strong> — 小车的"脚"<br>
                                🧠 <strong>控制器</strong> — 小车的"大脑"<br>
                                🔌 <strong>连接线</strong> — 小车的"神经"
                            </p>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.6;">
                                搭建小车就像<strong>搭积木</strong>一样！<br>
                                你觉得应该<strong>先放哪个零件</strong>？为什么？<br>
                                💡 提示：盖房子要先打地基哦~
                            </div>
                        </div>
                    </div>`;
                case 1: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🔧','认识搭建零件','了解每个零件长什么样子，放在小车的什么位置')}
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:12px 0;">
                            ${allSteps.slice(0,4).map(s => `
                                <div class="cw-part-intro-card" style="border-left:4px solid ${s.color};">
                                    <div style="font-size:32px;">${s.icon}</div>
                                    <div style="font-size:14px;font-weight:800;color:#1a2a6c;">${s.part}</div>
                                    <div style="font-size:11px;color:#7a6a5a;line-height:1.4;">${s.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">📐 小车结构图</div>
                            <div style="position:relative;width:100%;max-width:260px;height:140px;margin:0 auto;background:#faf8f2;border-radius:12px;border:2px dashed #d0c4b4;">
                                <div style="position:absolute;left:30%;bottom:20px;width:40%;height:12px;background:#8B6914;border-radius:3px;"></div>
                                <div style="position:absolute;left:45%;bottom:32px;width:20px;height:16px;background:#e74c3c;border-radius:3px;"></div>
                                <div style="position:absolute;left:20px;bottom:24px;width:12px;height:12px;background:#333;border-radius:50%;"></div>
                                <div style="position:absolute;right:20px;bottom:24px;width:12px;height:12px;background:#333;border-radius:50%;"></div>
                                <div style="position:absolute;left:42%;bottom:50px;width:24px;height:10px;background:#9b59b6;border-radius:2px;"></div>
                                <div style="font-size:9px;position:absolute;left:5px;bottom:4px;color:#7a6a5a;">轮子</div>
                                <div style="font-size:9px;position:absolute;right:5px;bottom:4px;color:#7a6a5a;">轮子</div>
                                <div style="font-size:9px;position:absolute;left:50%;bottom:44px;transform:translateX(-50%);color:#7a6a5a;">控制器</div>
                                <div style="font-size:9px;position:absolute;left:50%;bottom:14px;transform:translateX(-50%);color:#7a6a5a;">底盘</div>
                                <div style="font-size:9px;position:absolute;left:60%;bottom:28px;transform:translateX(-50%);color:#7a6a5a;">马达</div>
                            </div>
                        </div>
                    </div>`;
                case 2: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🏗️','动手搭建','跟着步骤把零件安装到正确位置')}
                        <div class="build-scene" id="buildScene">
                            <div class="grid-bg"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                            <span style="font-size:13px;color:#7a6a5a;">搭建进度</span>
                            <span style="font-size:13px;font-weight:700;color:#1a2a6c;" id="buildProgressText">0/5</span>
                        </div>
                        <div class="sim-progress" style="margin-bottom:8px;"><div class="sim-progress-bar" id="buildProgressBar" style="width:0%;"></div></div>
                        <div id="buildStepInfo" style="text-align:center;padding:12px;background:#f0ede4;border-radius:14px;font-size:14px;color:#4a3a2a;margin-bottom:10px;line-height:1.5;min-height:60px;">
                            👆 点击下方工具箱中的零件开始搭建
                        </div>
                        <div class="build-toolbar" id="buildToolbar">
                            ${allSteps.map(s => `<button class="build-tool-btn" data-tool="${s.id}">${s.icon} ${s.part}</button>`).join('')}
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="buildNextBtn">开始搭建 →</button>
                            <button class="sim-btn sim-btn-outline" id="buildResetBtn">🔄 重置</button>
                        </div>
                    </div>`;
                case 3: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🏆','搭建挑战','检验你对搭建顺序的掌握！')}
                        <div id="buildQuizArea" style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;">
                            <div style="font-size:48px;margin-bottom:8px;" id="bqEmoji">🔧</div>
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:14px;" id="bqQuestion">小车搭建的第一步应该装什么？</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="bqOptions"></div>
                            <div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="bqFeedback"></div>
                        </div>
                        <div style="display:flex;gap:12px;justify-content:center;margin-top:10px;">
                            <span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="bqScore">0</span>/5</span>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="bqStartBtn">🎮 开始挑战</button>
                            <button class="sim-btn sim-btn-outline" id="bqResetBtn">🔄 重来</button>
                        </div>
                    </div>`;
                case 4: return `
                    <div class="cw-page-inner">
                        ${celebrationHTML('小车搭建成功！','你完成了一台完整的机器人小车！','🚗')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:2;">
                                ✅ 认识了小车<strong>5大核心零件</strong><br>
                                ✅ 学会了正确的<strong>搭建顺序</strong>：底盘→马达→轮子→控制器→测试<br>
                                ✅ 理解了<strong>底盘是基础</strong>，马达是动力来源<br>
                                ✅ 轮子装在马达轴上<strong>才能转动</strong><br>
                                ✅ 控制器是<strong>小车的"大脑"</strong>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;">
                            <div style="font-size:28px;margin-bottom:4px;">🌟</div>
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div>
                            <div style="font-size:13px;color:#4a3a2a;">我们要<strong>让小车动起来</strong>！用程序控制它前进后退转弯！🕹️</div>
                        </div>
                    </div>`;
                default: return '';
            }
        }

        function buildHTML() {
            return `
                <style>
                    .cw-progress { height:5px; background:#e8e0d5; border-radius:10px; overflow:hidden; margin-bottom:12px; }
                    .cw-progress-fill { height:100%; background:linear-gradient(90deg,#4a90d9,#1a2a6c); border-radius:10px; transition:width .4s ease; }
                    .cw-dots-row { display:flex; gap:8px; justify-content:center; margin-bottom:6px; }
                    .cw-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a; }
                    .cw-dot.active { background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3); }
                    .cw-dot.done { background:#5cb85c;color:#fff;border-color:#5cb85c; }
                    .cw-dot:hover:not(.active) { border-color:#4a90d9; }
                    .cw-page-label { text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px; }
                    @keyframes cwFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                    .cw-page-inner { animation:cwFadeIn .35s ease-out; }
                    .cw-nav-bottom { display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px; }
                    .cw-nav-bottom .cw-indicator { font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center; }
                    .cw-nav-bottom button { min-width:90px; }
                    .cw-part-intro-card { background:#fff;border-radius:12px;padding:12px;text-align:center;transition:all .2s;border:2px solid #e8e0d5; }
                    .cw-part-intro-card:hover { transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.06); }
                    .build-scene { position:relative;width:100%;max-width:320px;height:180px;margin:0 auto;background:linear-gradient(#e8f0fe,#f0ede4);border-radius:20px;border:3px solid #e8e0d5;overflow:hidden; }
                    .build-scene .grid-bg { position:absolute;inset:0;background-image:radial-gradient(circle,#d0c4b4 1px,transparent 1px);background-size:20px 20px;opacity:.3; }
                    .build-part { position:absolute;transition:all .4s cubic-bezier(.34,1.56,.64,1);cursor:pointer; }
                    @keyframes buildBounce { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
                    .build-part.placed { animation:buildBounce .5s; }
                    .build-label { position:absolute;font-size:10px;font-weight:700;color:#fff;text-align:center;pointer-events:none;text-shadow:0 1px 2px rgba(0,0,0,.3); }
                    .build-toolbar { display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px; }
                    .build-tool-btn { padding:6px 14px;border-radius:20px;border:2px solid #e8e0d5;background:#fff;cursor:pointer;font-size:12px;font-weight:600;transition:all .2s; }
                    .build-tool-btn:hover { background:#e8f0fe;border-color:#4a90d9; }
                    .build-tool-btn.used { background:#d5f5e3;border-color:#5cb85c; }
                    @media(max-width:768px){
                        .cw-dot{width:24px;height:24px;font-size:11px;}
                        .cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}
                        .build-scene{height:160px;max-width:280px;}
                        .cw-part-intro-card{padding:10px 8px;}
                        .build-tool-btn{font-size:11px;padding:5px 10px;}
                    }
                    @media(max-width:480px){
                        .cw-dot{width:20px;height:20px;font-size:10px;}
                        .cw-dots-row{gap:5px;}
                        .cw-nav-bottom{gap:6px;flex-wrap:wrap;}
                        .cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}
                        .cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}
                        .build-scene{height:130px;max-width:260px;border-radius:14px;}
                        .build-toolbar{gap:4px;}
                        .build-tool-btn{font-size:10px;padding:4px 8px;border-radius:14px;}
                        .cw-part-intro-card{padding:8px 4px;border-radius:10px;}
                        .cw-page-label{font-size:11px;}
                    }
                </style>
                ${renderPageNav()}
                <div class="cw-content" id="cwContent">${renderPageContent(0)}</div>
                <div class="cw-nav-bottom">
                    <button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button>
                    <span class="cw-indicator" id="cwIndicator">1/${totalPages}</span>
                    <button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button>
                </div>
            `;
        }

        const html = buildHTML();
        const result = wrap('搭建我的第一台小车', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent');
                const cwPrevBtn = container.querySelector('#cwPrevBtn');
                const cwNextBtn = container.querySelector('#cwNextBtn');
                const cwIndicator = container.querySelector('#cwIndicator');

                function updateNavUI() {
                    container.querySelectorAll('.cw-dot').forEach((d,i) => {
                        d.className = 'cw-dot ' + (i===currentPage?'active':(i<currentPage?'done':''));
                        d.textContent = i<currentPage?'✓':(i+1);
                    });
                    const bar = container.querySelector('.cw-progress-fill');
                    if (bar) bar.style.width = ((currentPage+1)/totalPages*100)+'%';
                    const label = container.querySelector('.cw-page-label');
                    if (label) label.textContent = pageTitles[currentPage];
                    cwPrevBtn.disabled = currentPage === 0;
                    if (currentPage >= totalPages-1) {
                        cwNextBtn.textContent = '🎉 完成课程';
                        cwNextBtn.className = 'sim-btn sim-btn-success';
                    } else {
                        cwNextBtn.textContent = '下一页 →';
                        cwNextBtn.className = 'sim-btn sim-btn-primary';
                    }
                    cwIndicator.textContent = (currentPage+1)+'/'+totalPages;
                }

                function goToPage(n) {
                    if (n<0||n>=totalPages) return;
                    currentPage = n;
                    cwContent.innerHTML = renderPageContent(n);
                    updateNavUI();
                    bindPageEvents(n);
                }

                function bindPageEvents(n) {
                    if (n === 2) bindBuildPage();
                    if (n === 3) bindChallengePage();
                }

                function bindBuildPage() {
                    buildStep = 0; placedParts = {};
                    const scene = container.querySelector('#buildScene');
                    const progressBar = container.querySelector('#buildProgressBar');
                    const progressText = container.querySelector('#buildProgressText');
                    const stepInfo = container.querySelector('#buildStepInfo');
                    const toolbar = container.querySelector('#buildToolbar');
                    const nextBtn = container.querySelector('#buildNextBtn');
                    const resetBtn = container.querySelector('#buildResetBtn');
                    if (!scene || !nextBtn) return;

                    function updateBuildUI() {
                        const s = allSteps[buildStep];
                        const done = Object.keys(placedParts).length;
                        if (progressBar) progressBar.style.width = (done/allSteps.length*100)+'%';
                        if (progressText) progressText.textContent = done+'/'+allSteps.length;
                        if (nextBtn) {
                            nextBtn.textContent = buildStep===0?'开始搭建 →':(done>=allSteps.length?'✅ 搭建完成！':'下一步 →');
                        }
                        if (stepInfo && buildStep < allSteps.length) {
                            stepInfo.innerHTML = `<div style="font-size:18px;margin-bottom:4px;">${s.icon}</div><strong style="font-size:15px;">步骤${buildStep+1}/${allSteps.length}：${s.text}</strong><br><span style="color:#7a6a5a;font-size:13px;">${s.desc}</span>`;
                        }
                        if (toolbar) {
                            toolbar.querySelectorAll('[data-tool]').forEach(btn => {
                                btn.classList.toggle('used', !!placedParts[btn.dataset.tool]);
                            });
                        }
                    }

                    function placePart(stepObj) {
                        if (placedParts[stepObj.id]) return;
                        placedParts[stepObj.id] = true;
                        if (stepObj.id === 'base') {
                            const el = document.createElement('div'); el.className = 'build-part placed';
                            el.style.cssText = `left:${stepObj.x-40}px;top:${stepObj.y}px;width:${stepObj.w}px;height:${stepObj.h}px;background:${stepObj.color};border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.2);`;
                            el.id = 'part-base'; scene.appendChild(el);
                            const label = document.createElement('div'); label.className = 'build-label';
                            label.style.cssText = `left:${stepObj.x-40}px;top:${stepObj.y+2}px;width:${stepObj.w}px;font-size:9px;`;
                            label.textContent = '底盘'; scene.appendChild(label);
                        } else if (stepObj.id === 'motor') {
                            const el = document.createElement('div'); el.className = 'build-part placed';
                            el.style.cssText = `left:${stepObj.x-16}px;top:${stepObj.y-5}px;width:${stepObj.w}px;height:${stepObj.h}px;background:${stepObj.color};border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.2);`;
                            el.id = 'part-motor'; scene.appendChild(el);
                        } else if (stepObj.id === 'wheel') {
                            for (let i=0;i<4;i++) {
                                const wx=[60,60,170,170][i], wy=[128,148,128,148][i];
                                const el = document.createElement('div'); el.className = 'build-part placed';
                                el.style.cssText = `left:${wx}px;top:${wy}px;width:${stepObj.w}px;height:${stepObj.h}px;background:${stepObj.color};border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,.3);`;
                                el.id = 'part-wheel-'+i; scene.appendChild(el);
                            }
                        } else if (stepObj.id === 'controller') {
                            const el = document.createElement('div'); el.className = 'build-part placed';
                            el.style.cssText = `left:${stepObj.x-30}px;top:${stepObj.y}px;width:${stepObj.w}px;height:${stepObj.h}px;background:${stepObj.color};border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.2);`;
                            el.id = 'part-ctrl'; scene.appendChild(el);
                        } else if (stepObj.id === 'test') {
                            scene.querySelectorAll('.build-part').forEach(el => {
                                el.style.boxShadow = '0 0 16px rgba(92,184,92,.7)';
                                el.style.transition = 'box-shadow .5s';
                            });
                        }
                        if (Object.keys(placedParts).length === allSteps.length && stepInfo) {
                            setTimeout(() => {
                                stepInfo.innerHTML = celebrationHTML('小车搭建成功！','你的第一台机器人小车组装完成了！🚗','🤖');
                                toast('🎉 搭建完成！太棒了！');
                            }, 500);
                        }
                        updateBuildUI();
                    }

                    nextBtn.onclick = function() {
                        if (buildStep < allSteps.length) {
                            placePart(allSteps[buildStep]);
                            if (buildStep < allSteps.length - 1) buildStep++;
                            updateBuildUI();
                        }
                    };
                    resetBtn.onclick = function() {
                        buildStep = 0; placedParts = {};
                        scene.querySelectorAll('.build-part,.build-label').forEach(el => el.remove());
                        updateBuildUI();
                        toast('🔄 已重置');
                    };
                    if (toolbar) {
                        toolbar.querySelectorAll('[data-tool]').forEach(btn => {
                            btn.onclick = function() {
                                const tid = this.dataset.tool;
                                if (placedParts[tid]) { toast('✅ 已安装'); return; }
                                const idx = allSteps.findIndex(s => s.id === tid);
                                if (idx >= 0) { buildStep = idx; placePart(allSteps[idx]); if (buildStep < allSteps.length-1) buildStep++; updateBuildUI(); }
                            };
                        });
                    }
                    updateBuildUI();
                }

                function bindChallengePage() {
                    const bqEmoji = container.querySelector('#bqEmoji');
                    const bqQuestion = container.querySelector('#bqQuestion');
                    const bqOptions = container.querySelector('#bqOptions');
                    const bqFeedback = container.querySelector('#bqFeedback');
                    const bqScore = container.querySelector('#bqScore');
                    const bqStartBtn = container.querySelector('#bqStartBtn');
                    const bqResetBtn = container.querySelector('#bqResetBtn');
                    challengeScore = 0; let bqRound = 0; let bqActive = false;

                    const buildQuiz = [
                        { q:'搭建小车的第一步应该装什么？', opts:['马达','底盘','轮子','控制器'], ans:1, emoji:'🟫', hint:'基础最重要，先搭平台' },
                        { q:'马达应该装在哪里？', opts:['底盘前端','底盘上面','底盘后端','轮子旁边'], ans:2, emoji:'⚡', hint:'马达是动力，装在后面推着走' },
                        { q:'轮子装在什么零件上？', opts:['底盘','控制器','积木','马达轴'], ans:3, emoji:'🔄', hint:'轮子套在马达的轴上转动' },
                        { q:'控制器是小车的什么？', opts:['眼睛','大脑','肌肉','脚'], ans:1, emoji:'🧠', hint:'它负责接收命令和控制动作' },
                        { q:'最后一步应该做什么？', opts:['装轮子','装马达','装控制器','通电测试'], ans:3, emoji:'🔌', hint:'装好所有零件后要检查能否工作' }
                    ];

                    function nextBQ() {
                        if (bqRound >= 5) {
                            if (bqEmoji) bqEmoji.textContent = challengeScore>=4?'🏆':challengeScore>=3?'😊':'💪';
                            if (bqQuestion) bqQuestion.textContent = challengeScore>=4?'搭建大师！你全都会了！':'再复习一下搭建顺序吧~';
                            if (bqOptions) bqOptions.innerHTML = '';
                            if (bqFeedback) bqFeedback.innerHTML = starBadge(challengeScore,5)+'<br><span style="font-size:14px;">'+challengeScore+'/5 分</span>';
                            bqActive = false;
                            if (bqStartBtn) bqStartBtn.textContent = '🔄 再来一次';
                            if (challengeScore>=4) toast('🏆 搭建大师！');
                            return;
                        }
                        const q = buildQuiz[bqRound];
                        bqRound++;
                        if (bqEmoji) bqEmoji.textContent = q.emoji;
                        if (bqQuestion) bqQuestion.textContent = '第'+bqRound+'题：'+q.q;
                        if (bqOptions) bqOptions.innerHTML = q.opts.map((o,i) => '<button class="sim-btn sim-btn-outline" data-bopt="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');
                        if (bqFeedback) bqFeedback.innerHTML = '<span style="color:#7a6a5a;">选一个答案吧~</span>';
                        bqActive = true;
                        if (bqOptions) {
                            bqOptions.querySelectorAll('[data-bopt]').forEach(btn => {
                                btn.onclick = function() {
                                    if (!bqActive) return;
                                    bqActive = false;
                                    const ans = parseInt(this.dataset.bopt);
                                    bqOptions.querySelectorAll('[data-bopt]').forEach(b => b.disabled = true);
                                    if (ans === q.ans) {
                                        challengeScore++;
                                        if (bqScore) bqScore.textContent = challengeScore;
                                        if (bqFeedback) bqFeedback.innerHTML = '<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';
                                        toast('✅ 答对了！');
                                    } else {
                                        if (bqFeedback) bqFeedback.innerHTML = '<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';
                                        toast('❌ 再想想~');
                                    }
                                    setTimeout(nextBQ, 1500);
                                };
                            });
                        }
                    }

                    if (bqStartBtn) bqStartBtn.onclick = function() {
                        challengeScore=0; bqRound=0; if(bqScore)bqScore.textContent='0';
                        if(bqFeedback)bqFeedback.innerHTML=''; nextBQ(); this.textContent='⏳ 答题中...';
                    };
                    if (bqResetBtn) bqResetBtn.onclick = function() {
                        bqActive=false; challengeScore=0; bqRound=0;
                        if(bqScore)bqScore.textContent='0'; if(bqEmoji)bqEmoji.textContent='🔧';
                        if(bqQuestion)bqQuestion.textContent='小车搭建的第一步应该装什么？';
                        if(bqOptions)bqOptions.innerHTML='';
                        if(bqFeedback)bqFeedback.innerHTML='';
                        if(bqStartBtn)bqStartBtn.textContent='🎮 开始挑战';
                        toast('🔄 已重置');
                    };
                }

                cwPrevBtn.addEventListener('click', () => { if (currentPage>0) goToPage(currentPage-1); });
                cwNextBtn.addEventListener('click', () => {
                    if (currentPage >= totalPages-1) { toast('🎉 恭喜完成第二课！'); }
                    else { goToPage(currentPage+1); }
                });
                container.querySelectorAll('.cw-dot').forEach(dot => {
                    dot.addEventListener('click', function() {
                        const target = parseInt(this.dataset.goto);
                        if (target <= currentPage || target === currentPage + 1) goToPage(target);
                    });
                });
                updateNavUI();
            }
        };
    };

    // ============================================================
    //  第3课：让小车动起来 — 6页线上课件
    // ============================================================
    registry['1-3'] = function() {
        let posX=140, posY=160, speed=50;
        const sPathPoints = [
            {x:40,y:150,label:'起点'},{x:90,y:120},{x:140,y:150},{x:190,y:120},{x:240,y:150},{x:260,y:90,label:'终点'}
        ];

        let currentPage = 0;
        const totalPages = 6;
        const pageTitles = ['📖 场景引入','🧭 运动方向','🕹️ 自由操控','💻 编程初体验','🎯 S形路径挑战','🎉 课堂小结'];
        let programQueue = [], programRunning = false;

        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${i<currentPage?'✓':(i+1)}</span>`;
            }
            return `
                <div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div>
                <div class="cw-dots-row">${dots}</div>
                <div class="cw-page-label">${pageTitles[currentPage]}</div>
            `;
        }

        function renderPageContent(n) {
            switch(n) {
                case 0: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🚗','让小车动起来！','小车搭好了，但它还不会动——怎么让它跑起来呢？')}
                        <div style="text-align:center;margin:16px 0;">
                            <div style="display:inline-block;animation:simWalk 2s ease-in-out infinite;">
                                <div style="font-size:72px;">🚗💨</div>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;">
                            <p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">
                                想让小车动起来，你需要告诉它<strong style="color:#1a2a6c;">4个基本动作</strong>：<br>
                                ⬆️ <strong>前进</strong> — 向前走<br>
                                ⬇️ <strong>后退</strong> — 向后退<br>
                                ⬅️ <strong>左转</strong> — 向左拐<br>
                                ➡️ <strong>右转</strong> — 向右拐
                            </p>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.6;">
                                如果你想让小车<strong>从教室门口走到窗边</strong>，<br>
                                它需要哪些动作呢？<br>
                                💡 提示：可能需要前进+转弯的组合哦~
                            </div>
                        </div>
                    </div>`;
                case 1: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🧭','认识四个运动方向','学习前进、后退、左转、右转')}
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;">
                            <div class="cw-dir-card" style="--dc:#5cb85c;"><div style="font-size:40px;">⬆️</div><div style="font-size:15px;font-weight:800;color:#1a6e3a;">前进</div><div style="font-size:11px;color:#4a3a2a;">向前方移动<br>小车面朝的方向</div></div>
                            <div class="cw-dir-card" style="--dc:#e74c3c;"><div style="font-size:40px;">⬇️</div><div style="font-size:15px;font-weight:800;color:#922b21;">后退</div><div style="font-size:11px;color:#4a3a2a;">向后方移动<br>倒车回到原位</div></div>
                            <div class="cw-dir-card" style="--dc:#4a90d9;"><div style="font-size:40px;">⬅️</div><div style="font-size:15px;font-weight:800;color:#1a5276;">左转</div><div style="font-size:11px;color:#4a3a2a;">向左拐弯<br>改变行进方向</div></div>
                            <div class="cw-dir-card" style="--dc:#e67e22;"><div style="font-size:40px;">➡️</div><div style="font-size:15px;font-weight:800;color:#a04000;">右转</div><div style="font-size:11px;color:#4a3a2a;">向右拐弯<br>改变行进方向</div></div>
                        </div>
                        <div style="background:#f0ede4;border-radius:14px;padding:14px;text-align:center;margin-top:10px;">
                            <div style="font-size:13px;font-weight:700;color:#1a2a6c;">🔑 关键理解</div>
                            <div style="font-size:12px;color:#4a3a2a;line-height:1.6;margin-top:4px;">
                                小车只能<strong>面朝一个方向</strong>行驶<br>
                                "前进"=沿面对的方向走，"后退"=反向走<br>
                                "左转/右转"=改变面对的方向
                            </div>
                        </div>
                    </div>`;
                case 2: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🕹️','自由操控小车','用方向按钮控制小车自由移动，感受每个方向的效果')}
                        <div class="drive-scene" id="driveSceneFree" style="height:180px;">
                            <div class="drive-car" id="driveCarFree" style="top:${posY-14}px;left:${posX-22}px;">
                                <div class="drive-car-body"><div class="eye eye-l"></div><div class="eye eye-r"></div><div class="wheels"><div class="wh wh-fl"></div><div class="wh wh-fr"></div><div class="wh wh-rl"></div><div class="wh wh-rr"></div></div></div>
                            </div>
                        </div>
                        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:10px 0;">
                            <div><span class="sim-label">速度</span> <input type="range" class="sim-slider" id="speedSlider" min="10" max="100" value="50"> <span class="sim-value" id="speedDisplay">50</span></div>
                            <div><span class="sim-status sim-status-info" id="dirDisplay">⏹ 待命中</span></div>
                        </div>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:260px;margin:0 auto 10px;">
                            <div></div>
                            <button class="sim-btn sim-btn-primary" data-drive="forward" style="padding:14px;font-size:20px;">⬆️ 前进</button><div></div>
                            <button class="sim-btn sim-btn-primary" data-drive="left" style="padding:14px;font-size:20px;">⬅️ 左转</button>
                            <button class="sim-btn sim-btn-danger" id="stopBtnFree" style="padding:14px;font-size:16px;">⏹ 停</button>
                            <button class="sim-btn sim-btn-primary" data-drive="right" style="padding:14px;font-size:20px;">右转 ➡️</button><div></div>
                            <button class="sim-btn sim-btn-primary" data-drive="backward" style="padding:14px;font-size:20px;">⬇️ 后退</button><div></div>
                        </div>
                    </div>`;
                case 3: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('💻','编程初体验','什么是"程序"？就是把指令排好队，让小车自动执行！')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:10px;">🌰 生活举例：刷牙的"程序"</div>
                            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:center;font-size:13px;color:#4a3a2a;">
                                <span style="background:#e8f0fe;padding:6px 12px;border-radius:16px;">🪥 拿起牙刷</span> →
                                <span style="background:#e8f0fe;padding:6px 12px;border-radius:16px;">🧴 挤牙膏</span> →
                                <span style="background:#e8f0fe;padding:6px 12px;border-radius:16px;">🦷 上下刷</span> →
                                <span style="background:#e8f0fe;padding:6px 12px;border-radius:16px;">💧 漱口</span> →
                                <span style="background:#d5f5e3;padding:6px 12px;border-radius:16px;">✨ 完成！</span>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:14px;margin:12px 0;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🤖 小车程序也一样</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.8;">
                                把<strong>方向指令排好顺序</strong> → 小车<strong>自动按顺序执行</strong><br>
                                例如：前进 → 前进 → 右转 → 前进 = <strong>走一个L形路线！</strong>
                            </div>
                        </div>
                        <div style="text-align:center;padding:10px;background:#f0ede4;border-radius:12px;font-size:12px;color:#7a6a5a;">
                            💡 <strong>程序 = 指令的顺序组合</strong>，就像做事情的步骤清单！
                        </div>
                    </div>`;
                case 4: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🎯','S形路径挑战','编程序列让小车沿S形路线到达终点！')}
                        <div class="drive-scene" id="driveSceneChallenge" style="height:200px;">
                            ${sPathPoints.map((pt,i) => `
                                <div class="drive-waypoint" id="wp${i}" style="left:${pt.x-10}px;top:${pt.y-10}px;${i===0?'background:rgba(92,184,92,.5);border-color:#5cb85c;border-style:solid;':''}${i===sPathPoints.length-1?'background:rgba(231,76,60,.4);border-color:#e74c3c;':''}">${i===0?'🚩':i===sPathPoints.length-1?'🏁':'●'}</div>
                            `).join('')}
                            <div class="drive-car" id="driveCarChallenge" style="top:${sPathPoints[0].y-14}px;left:${sPathPoints[0].x-22}px;">
                                <div class="drive-car-body"><div class="eye eye-l"></div><div class="eye eye-r"></div><div class="wheels"><div class="wh wh-fl"></div><div class="wh wh-fr"></div><div class="wh wh-rl"></div><div class="wh wh-rr"></div></div></div>
                            </div>
                        </div>
                        <div style="margin:8px 0;">
                            <div style="font-size:12px;color:#7a6a5a;margin-bottom:4px;">📋 指令序列：</div>
                            <div id="programSlots" style="display:flex;gap:6px;flex-wrap:wrap;min-height:36px;padding:6px;background:#faf8f2;border-radius:12px;border:2px dashed #e8e0d5;">
                                <span style="color:#d0c4b4;font-size:12px;">点击下方指令按钮添加...</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                            <button class="sim-btn sim-btn-primary prog-cmd" data-cmd="forward" style="padding:8px 14px;font-size:12px;">⬆️前进</button>
                            <button class="sim-btn sim-btn-warning prog-cmd" data-cmd="left" style="padding:8px 14px;font-size:12px;">⬅️左转</button>
                            <button class="sim-btn sim-btn-warning prog-cmd" data-cmd="right" style="padding:8px 14px;font-size:12px;">➡️右转</button>
                            <button class="sim-btn sim-btn-outline prog-cmd" data-cmd="backward" style="padding:8px 14px;font-size:12px;">⬇️后退</button>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="runProgramBtn">▶️ 运行</button>
                            <button class="sim-btn sim-btn-danger" id="clearProgramBtn">🗑️ 清除</button>
                            <button class="sim-btn sim-btn-outline" id="resetChallengeBtn">🔄 重置</button>
                        </div>
                        <div id="challengeMsg" style="text-align:center;margin-top:8px;font-size:13px;color:#7a6a5a;"></div>
                    </div>`;
                case 5: return `
                    <div class="cw-page-inner">
                        ${celebrationHTML('运动达人！','你学会了控制小车前进、后退、左转、右转！','🏎️')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:2;">
                                ✅ 小车的<strong>4个运动方向</strong>：前进、后退、左转、右转<br>
                                ✅ 用<strong>方向按钮</strong>自由操控小车移动<br>
                                ✅ <strong>程序 = 指令按顺序排列</strong><br>
                                ✅ 编写指令序列让小车<strong>自动沿路线行驶</strong><br>
                                ✅ 理解了<strong>编程就是"给机器人下指令"</strong>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;">
                            <div style="font-size:28px;margin-bottom:4px;">🌟</div>
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div>
                            <div style="font-size:13px;color:#4a3a2a;">我们要给小车装上<strong>颜色传感器</strong>，让它能"看见"颜色！👁️🌈</div>
                        </div>
                    </div>`;
                default: return '';
            }
        }

        function buildHTML() {
            return `
                <style>
                    .cw-progress { height:5px; background:#e8e0d5; border-radius:10px; overflow:hidden; margin-bottom:12px; }
                    .cw-progress-fill { height:100%; background:linear-gradient(90deg,#4a90d9,#1a2a6c); border-radius:10px; transition:width .4s ease; }
                    .cw-dots-row { display:flex; gap:8px; justify-content:center; margin-bottom:6px; }
                    .cw-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a; }
                    .cw-dot.active { background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3); }
                    .cw-dot.done { background:#5cb85c;color:#fff;border-color:#5cb85c; }
                    .cw-dot:hover:not(.active) { border-color:#4a90d9; }
                    .cw-page-label { text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px; }
                    @keyframes cwFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                    .cw-page-inner { animation:cwFadeIn .35s ease-out; }
                    .cw-nav-bottom { display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px; }
                    .cw-nav-bottom .cw-indicator { font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center; }
                    .cw-nav-bottom button { min-width:90px; }
                    .cw-dir-card { background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;transition:all .2s; }
                    .cw-dir-card:hover { border-color:var(--dc,#4a90d9);transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.08); }
                    .drive-scene { position:relative;width:100%;max-width:340px;margin:0 auto;background:linear-gradient(#faf8f2,#f0ede4);border-radius:20px;border:3px solid #e8e0d5;overflow:hidden; }
                    .drive-car { position:absolute;transition:all .4s ease;z-index:2; }
                    .drive-car-body { width:44px;height:28px;background:#4a90d9;border-radius:8px;position:relative; }
                    .drive-car-body .eye { width:7px;height:7px;background:#fff;border-radius:50%;position:absolute;top:7px; }
                    .drive-car-body .eye::after { content:'';display:block;width:4px;height:4px;background:#1a2a6c;border-radius:50%;margin:1.5px auto; }
                    .drive-car-body .eye-l { left:9px; } .drive-car-body .eye-r { right:9px; }
                    .drive-car-body .wheels { position:absolute;bottom:-5px; }
                    .drive-car-body .wh { width:9px;height:6px;background:#333;border-radius:3px;position:absolute; }
                    .drive-car-body .wh-fl{left:4px;} .drive-car-body .wh-fr{right:4px;} .drive-car-body .wh-rl{left:14px;bottom:2px;} .drive-car-body .wh-rr{right:14px;bottom:2px;}
                    .drive-waypoint { position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(255,215,0,.4);border:2px dashed #C8A86B;display:flex;align-items:center;justify-content:center;font-size:10px; }
                    .drive-waypoint.reached { background:rgba(92,184,92,.4);border-color:#5cb85c;border-style:solid; }
                    @media(max-width:768px){
                        .cw-dot{width:24px;height:24px;font-size:11px;}
                        .cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}
                        .drive-scene{height:170px;max-width:300px;}
                        .cw-dir-card{padding:10px 8px;}
                    }
                    @media(max-width:480px){
                        .cw-dot{width:20px;height:20px;font-size:10px;}
                        .cw-dots-row{gap:5px;}
                        .cw-nav-bottom{gap:6px;flex-wrap:wrap;}
                        .cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}
                        .cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}
                        .drive-scene{height:140px;max-width:280px;border-radius:14px;border-width:2px;}
                        .drive-car-body{width:36px;height:22px;border-radius:6px;}
                        .drive-waypoint{width:16px;height:16px;font-size:8px;}
                        .cw-dir-card{padding:8px 4px;border-radius:12px;font-size:11px;}
                        .cw-page-label{font-size:11px;}
                        .prog-cmd{padding:6px 10px!important;font-size:10px!important;}
                    }
                </style>
                ${renderPageNav()}
                <div class="cw-content" id="cwContent">${renderPageContent(0)}</div>
                <div class="cw-nav-bottom">
                    <button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button>
                    <span class="cw-indicator" id="cwIndicator">1/${totalPages}</span>
                    <button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button>
                </div>
            `;
        }

        const html = buildHTML();
        const result = wrap('让小车动起来', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent');
                const cwPrevBtn = container.querySelector('#cwPrevBtn');
                const cwNextBtn = container.querySelector('#cwNextBtn');
                const cwIndicator = container.querySelector('#cwIndicator');

                function updateNavUI() {
                    container.querySelectorAll('.cw-dot').forEach((d,i) => {
                        d.className = 'cw-dot ' + (i===currentPage?'active':(i<currentPage?'done':''));
                        d.textContent = i<currentPage?'✓':(i+1);
                    });
                    const bar = container.querySelector('.cw-progress-fill');
                    if (bar) bar.style.width = ((currentPage+1)/totalPages*100)+'%';
                    const label = container.querySelector('.cw-page-label');
                    if (label) label.textContent = pageTitles[currentPage];
                    cwPrevBtn.disabled = currentPage === 0;
                    if (currentPage >= totalPages-1) {
                        cwNextBtn.textContent = '🎉 完成课程';
                        cwNextBtn.className = 'sim-btn sim-btn-success';
                    } else {
                        cwNextBtn.textContent = '下一页 →';
                        cwNextBtn.className = 'sim-btn sim-btn-primary';
                    }
                    cwIndicator.textContent = (currentPage+1)+'/'+totalPages;
                }

                function goToPage(n) {
                    if (n<0||n>=totalPages) return;
                    if (currentPage === 4) programRunning = false;
                    currentPage = n;
                    cwContent.innerHTML = renderPageContent(n);
                    updateNavUI();
                    bindPageEvents(n);
                }

                function bindPageEvents(n) {
                    if (n === 2) bindFreeDrivePage();
                    if (n === 4) bindChallengePage();
                }

                function bindFreeDrivePage() {
                    const carFree = container.querySelector('#driveCarFree');
                    const dirDisplay = container.querySelector('#dirDisplay');
                    const spdSlider = container.querySelector('#speedSlider');
                    const spdDisplay = container.querySelector('#speedDisplay');
                    if (!carFree) return;
                    posX=140; posY=150; speed=50;
                    if (spdSlider) spdSlider.oninput = function() { speed=parseInt(this.value); if(spdDisplay)spdDisplay.textContent=speed; };
                    container.querySelectorAll('[data-drive]').forEach(btn => {
                        btn.onclick = function() {
                            const dir = this.dataset.drive;
                            const step = 6*(speed/50);
                            const names = {forward:'⬆️ 前进',backward:'⬇️ 后退',left:'⬅️ 左转',right:'➡️ 右转'};
                            if (dirDisplay) dirDisplay.innerHTML = names[dir];
                            if (dir==='forward') posY=Math.max(0,posY-step);
                            else if (dir==='backward') posY=Math.min(162,posY+step);
                            else if (dir==='left') posX=Math.max(0,posX-step);
                            else if (dir==='right') posX=Math.min(296,posX+step);
                            carFree.style.top=(posY-14)+'px';
                            carFree.style.left=(posX-22)+'px';
                        };
                    });
                    const stopBtn = container.querySelector('#stopBtnFree');
                    if (stopBtn) stopBtn.onclick = function() { if(dirDisplay)dirDisplay.innerHTML='⏹ 已停止'; };
                }

                function bindChallengePage() {
                    const carChallenge = container.querySelector('#driveCarChallenge');
                    const programSlots = container.querySelector('#programSlots');
                    const challengeMsg = container.querySelector('#challengeMsg');
                    programQueue = []; programRunning = false;

                    function updateProgUI() {
                        if (!programSlots) return;
                        if (programQueue.length === 0) {
                            programSlots.innerHTML = '<span style="color:#d0c4b4;font-size:12px;">点击下方指令按钮添加...</span>';
                        } else {
                            const icons = {forward:'⬆️',backward:'⬇️',left:'⬅️',right:'➡️'};
                            programSlots.innerHTML = programQueue.map((cmd,i) => '<span class="drive-prog-slot" style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#f0ede4;border-radius:16px;font-size:12px;font-weight:600;margin:2px;">'+icons[cmd]+' 第'+(i+1)+'步</span>').join('');
                        }
                    }

                    container.querySelectorAll('.prog-cmd').forEach(btn => {
                        btn.onclick = function() {
                            if (programRunning) { toast('⏸️ 程序运行中'); return; }
                            if (programQueue.length >= 12) { toast('⚠️ 最多12步'); return; }
                            programQueue.push(this.dataset.cmd);
                            updateProgUI();
                        };
                    });

                    const clearBtn = container.querySelector('#clearProgramBtn');
                    const runBtn = container.querySelector('#runProgramBtn');
                    const resetBtn = container.querySelector('#resetChallengeBtn');

                    if (clearBtn) clearBtn.onclick = function() { if(!programRunning){programQueue=[];updateProgUI();if(challengeMsg)challengeMsg.innerHTML='';toast('🗑️ 已清除');} };
                    if (resetBtn) resetBtn.onclick = function() {
                        programRunning=false; programQueue=[]; updateProgUI();
                        if(carChallenge){carChallenge.style.top=(sPathPoints[0].y-14)+'px';carChallenge.style.left=(sPathPoints[0].x-22)+'px';}
                        if(challengeMsg)challengeMsg.innerHTML='';
                        sPathPoints.forEach((_,i)=>{if(i>0){const wp=container.querySelector('#wp'+i);if(wp)wp.classList.remove('reached');}});
                        toast('🔄 已重置');
                    };

                    if (runBtn) runBtn.onclick = function() {
                        if (programRunning) return;
                        if (programQueue.length === 0) { toast('⚠️ 请先添加指令'); return; }
                        programRunning = true;
                        if (challengeMsg) challengeMsg.innerHTML = '<span style="color:#4a90d9;">⏳ 程序运行中...</span>';
                        if (carChallenge) { carChallenge.style.top=(sPathPoints[0].y-14)+'px'; carChallenge.style.left=(sPathPoints[0].x-22)+'px'; }
                        let cpx=sPathPoints[0].x, cpy=sPathPoints[0].y, cmdIdx=0;
                        let reachedWp=new Set([0]);
                        function runNext() {
                            if (!programRunning || cmdIdx >= programQueue.length) {
                                programRunning = false;
                                let bestWp=0;
                                for(let i=0;i<sPathPoints.length;i++){const dx=cpx-sPathPoints[i].x,dy=cpy-sPathPoints[i].y;if(Math.sqrt(dx*dx+dy*dy)<40)bestWp=i;}
                                if(challengeMsg){
                                    if(bestWp>=sPathPoints.length-2) challengeMsg.innerHTML=celebrationHTML('挑战成功！','小车通过了S形路线！🏆','🏆');
                                    else if(bestWp>=2) challengeMsg.innerHTML='<span style="color:#e67e22;">👍 还不错！通过了部分路径</span>';
                                    else challengeMsg.innerHTML='<span style="color:#e74c3c;">💡 再试试不同的指令组合</span>';
                                }
                                if(bestWp>=sPathPoints.length-2) toast('🏆 S形路径挑战成功！');
                                return;
                            }
                            const cmd=programQueue[cmdIdx], step=8;
                            if(cmd==='forward')cpy=Math.max(0,cpy-step);
                            else if(cmd==='backward')cpy=Math.min(182,cpy+step);
                            else if(cmd==='left')cpx=Math.max(10,cpx-step);
                            else if(cmd==='right')cpx=Math.min(310,cpx+step);
                            if(carChallenge){carChallenge.style.top=(cpy-14)+'px';carChallenge.style.left=(cpx-22)+'px';}
                            for(let i=0;i<sPathPoints.length;i++){
                                if(reachedWp.has(i))continue;
                                const dx=cpx-sPathPoints[i].x,dy=cpy-sPathPoints[i].y;
                                if(Math.sqrt(dx*dx+dy*dy)<35){reachedWp.add(i);const wp=container.querySelector('#wp'+i);if(wp)wp.classList.add('reached');toast('✅ 到达路径点！');}
                            }
                            cmdIdx++;
                            setTimeout(runNext, 300);
                        }
                        runNext();
                    };
                    updateProgUI();
                }

                cwPrevBtn.addEventListener('click', () => { if (currentPage>0) goToPage(currentPage-1); });
                cwNextBtn.addEventListener('click', () => {
                    if (currentPage >= totalPages-1) { toast('🎉 恭喜完成第三课！'); }
                    else { goToPage(currentPage+1); }
                });
                container.querySelectorAll('.cw-dot').forEach(dot => {
                    dot.addEventListener('click', function() {
                        const target = parseInt(this.dataset.goto);
                        if (target <= currentPage || target === currentPage + 1) goToPage(target);
                    });
                });
                updateNavUI();
            }
        };
    };

    // ============================================================
    //  第4课：颜色传感器大冒险 — 6页线上课件
    // ============================================================
    registry['1-4'] = function() {
        const colors = [
            { emoji:'🔴', name:'红色', hex:'#e74c3c', action:'停止', actionIcon:'🛑', desc:'红色像"红灯"，看到红色要停下来！' },
            { emoji:'🟢', name:'绿色', hex:'#5cb85c', action:'前进', actionIcon:'🚀', desc:'绿色像"绿灯"，看到绿色可以前进！' },
            { emoji:'🔵', name:'蓝色', hex:'#4a90d9', action:'左转', actionIcon:'⬅️', desc:'蓝色像"左转箭头"，看到蓝色向左拐！' },
            { emoji:'🟡', name:'黄色', hex:'#f1c40f', action:'右转', actionIcon:'➡️', desc:'黄色像"右转箭头"，看到黄色向右拐！' }
        ];
        const correctMap = { '红色':'停止','绿色':'前进','蓝色':'左转','黄色':'右转' };
        const actionList = ['停止','前进','左转','右转'];

        let currentPage = 0;
        const totalPages = 6;
        const pageTitles = ['📖 场景引入','📖 颜色规则','⚡ 反应力挑战','💻 颜色编程','🏆 综合闯关','🎉 课堂小结'];
        let reactScore=0, reactRound=0, reactActive=false, reactColor=null, reactTimer=null, reactInterval=null, streak=0, timeLeft=0;
        let colorProg=[], progActive=false, simCarX=150, simCarY=100;

        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${i<currentPage?'✓':(i+1)}</span>`;
            }
            return `
                <div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div>
                <div class="cw-dots-row">${dots}</div>
                <div class="cw-page-label">${pageTitles[currentPage]}</div>
            `;
        }

        function renderPageContent(n) {
            switch(n) {
                case 0: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('👁️','颜色的秘密','机器人用什么"看"世界？——颜色传感器！')}
                        <div style="text-align:center;margin:16px 0;">
                            <div style="display:flex;gap:12px;justify-content:center;animation:simFloat 2s ease-in-out infinite;">
                                <span style="font-size:48px;">🔴</span><span style="font-size:48px;">🟢</span><span style="font-size:48px;">🔵</span><span style="font-size:48px;">🟡</span>
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;">
                            <p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">
                                🚦 就像<strong style="color:#e74c3c;">红绿灯</strong>指挥交通一样：<br>
                                🔴 <strong>红灯亮</strong> → 🛑 车停下来<br>
                                🟢 <strong>绿灯亮</strong> → 🚀 车开过去<br>
                                机器人的<strong style="color:#1a2a6c;">颜色传感器</strong>也一样！<br>
                                它能"看到"颜色并告诉机器人该做什么！
                            </p>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.6;">
                                你还在哪里见过<strong>颜色代表"指令"</strong>？<br>
                                💡 提示：运动比赛中的红牌和黄牌...
                            </div>
                        </div>
                    </div>`;
                case 1: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('📖','颜色规则学习','每种颜色代表一个机器人动作指令')}
                        <div class="color-learn-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                            ${colors.map(c => `
                                <div class="color-learn-card" data-clr="${c.name}" style="background:#fff;border-radius:16px;padding:12px 8px;text-align:center;border:3px solid #e8e0d5;cursor:pointer;transition:all .2s;">
                                    <div style="font-size:36px;">${c.emoji}</div>
                                    <div style="font-size:12px;font-weight:700;color:#4a3a2a;">${c.name}</div>
                                    <div style="font-size:15px;font-weight:800;color:${c.hex};">→ ${c.actionIcon} ${c.action}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="text-align:center;margin-top:14px;">
                            <div style="display:inline-block;position:relative;">
                                <div class="color-demo-light" id="demoLight" style="width:80px;height:80px;border-radius:50%;background:#ddd;line-height:80px;font-size:32px;border:4px solid #e8e0d5;transition:all .3s;">🎯</div>
                            </div>
                            <div style="margin-top:6px;font-size:13px;color:#7a6a5a;">🚗 小车状态：<span style="font-weight:700;color:#1a2a6c;" id="demoCarState">等待指令</span></div>
                        </div>
                        <div id="learnInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:14px;font-size:13px;color:#1a5276;margin-top:10px;">👆 点击颜色卡片，了解每种颜色的含义</div>
                    </div>`;
                case 2: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('⚡','颜色反应力挑战','看到颜色，快速选出正确动作！（限时3秒）')}
                        <div style="text-align:center;">
                            <div class="color-demo-light" id="reactLight" style="width:100px;height:100px;border-radius:50%;background:#ddd;line-height:100px;font-size:44px;border:5px solid #e8e0d5;margin:0 auto;transition:all .3s;">🎯</div>
                            <div class="sim-progress" style="width:80%;margin:10px auto;"><div class="sim-progress-bar" id="reactTimerBar" style="width:100%;background:linear-gradient(90deg,#5cb85c,#f1c40f,#e74c3c);"></div></div>
                            <div style="margin:8px 0;">
                                <span class="sim-label">⭐ 得分：</span><span class="sim-value" id="reactScore">0</span>
                                <span style="margin:0 12px;color:#d0c4b4;">|</span>
                                <span class="sim-label">📝 回合：</span><span class="sim-value" id="reactRound">0/8</span>
                                <span style="margin:0 12px;color:#d0c4b4;">|</span>
                                <span style="font-size:14px;font-weight:600;" id="reactStreak"></span>
                            </div>
                            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                                ${actionList.map(a => `<button class="sim-btn sim-btn-primary react-act-btn" data-act="${a}" style="padding:12px 16px;">${a}</button>`).join('')}
                            </div>
                            <div id="reactFeedback" style="margin-top:10px;font-size:14px;font-weight:600;color:#4a3a2a;min-height:24px;"></div>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="reactStartBtn">🎮 开始挑战</button>
                            <button class="sim-btn sim-btn-outline" id="reactResetBtn">🔄 重置</button>
                        </div>
                    </div>`;
                case 3: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('💻','颜色编程挑战','给小车编写颜色指令序列，让它自动完成任务！')}
                        <div class="color-car-scene" id="colorCarScene" style="position:relative;width:100%;max-width:300px;height:100px;margin:0 auto;background:linear-gradient(#f8f6f0,#e8e0d5);border-radius:16px;overflow:hidden;border:3px solid #e8e0d5;">
                            <div style="position:absolute;bottom:0;width:100%;height:3px;background:#555;"></div>
                            <div class="color-mini-car" id="colorMiniCar" style="position:absolute;left:${simCarX-14}px;top:${simCarY-20}px;font-size:28px;transition:all .5s ease;">🚗</div>
                        </div>
                        <div style="margin:8px 0;">
                            <div style="font-size:12px;color:#7a6a5a;margin-bottom:4px;">📋 颜色程序：</div>
                            <div id="colorProgSlots" style="display:flex;gap:6px;flex-wrap:wrap;min-height:36px;padding:6px;background:#faf8f2;border-radius:12px;border:2px dashed #e8e0d5;">
                                <span style="color:#d0c4b4;font-size:12px;">点击颜色按钮添加...</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">
                            ${colors.map(c => `<button class="sim-btn sim-btn-outline cprog-btn" data-cprog="${c.action}" style="padding:8px 12px;font-size:12px;border-color:${c.hex};">${c.emoji} ${c.action}</button>`).join('')}
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="colorProgRunBtn">▶️ 运行</button>
                            <button class="sim-btn sim-btn-danger" id="colorProgClearBtn">🗑️ 清除</button>
                            <button class="sim-btn sim-btn-outline" id="colorProgResetBtn">🔄 重置</button>
                        </div>
                        <div id="colorProgMsg" style="text-align:center;margin-top:8px;font-size:13px;color:#7a6a5a;"></div>
                    </div>`;
                case 4: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🏆','综合闯关','颜色规则 + 反应力 + 编程 — 终极考验！')}
                        <div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;">
                            <div style="font-size:48px;margin-bottom:8px;" id="finalEmoji">🏆</div>
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="finalQuestion">准备好了吗？综合闯关！</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="finalOptions"></div>
                            <div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="finalFeedback"></div>
                        </div>
                        <div style="display:flex;gap:12px;justify-content:center;margin-top:10px;">
                            <span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="finalScore">0</span>/6</span>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="finalStartBtn">🎮 开始闯关</button>
                            <button class="sim-btn sim-btn-outline" id="finalResetBtn">🔄 重来</button>
                        </div>
                    </div>`;
                case 5: return `
                    <div class="cw-page-inner">
                        ${celebrationHTML('颜色大师！','你掌握了颜色传感器，让机器人"看见"世界！','🌈')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:2;">
                                ✅ <strong>4种颜色指令</strong>：🔴停 🟢行 🔵左 🟡右<br>
                                ✅ 颜色传感器是机器人的<strong>"眼睛"</strong><br>
                                ✅ 能在<strong>3秒内快速反应</strong>颜色与动作的匹配<br>
                                ✅ 学会用颜色指令<strong>编写程序</strong>控制小车<br>
                                ✅ 理解了<strong>感知→决策→行动</strong>的完整链路
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:12px 0;">
                            ${colors.map(c => `<span style="background:#fff;border:2px solid ${c.hex};border-radius:20px;padding:6px 14px;font-size:13px;font-weight:700;">${c.emoji} = ${c.actionIcon} ${c.action}</span>`).join('')}
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;">
                            <div style="font-size:28px;margin-bottom:4px;">🌟</div>
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R01课程完成！</div>
                            <div style="font-size:13px;color:#4a3a2a;">你已经完成了<strong>机器人初探与感知世界</strong>的全部4节课！</div>
                        </div>
                    </div>`;
                default: return '';
            }
        }

        function buildHTML() {
            return `
                <style>
                    .cw-progress { height:5px; background:#e8e0d5; border-radius:10px; overflow:hidden; margin-bottom:12px; }
                    .cw-progress-fill { height:100%; background:linear-gradient(90deg,#4a90d9,#1a2a6c); border-radius:10px; transition:width .4s ease; }
                    .cw-dots-row { display:flex; gap:8px; justify-content:center; margin-bottom:6px; }
                    .cw-dot { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a; }
                    .cw-dot.active { background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3); }
                    .cw-dot.done { background:#5cb85c;color:#fff;border-color:#5cb85c; }
                    .cw-dot:hover:not(.active) { border-color:#4a90d9; }
                    .cw-page-label { text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px; }
                    @keyframes cwFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                    .cw-page-inner { animation:cwFadeIn .35s ease-out; }
                    .cw-nav-bottom { display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px; }
                    .cw-nav-bottom .cw-indicator { font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center; }
                    .cw-nav-bottom button { min-width:90px; }
                    .color-learn-card:hover { transform:translateY(-4px);box-shadow:0 6px 16px rgba(0,0,0,.1); }
                    .color-learn-card.selected { border-color:#1a2a6c!important;background:#e8f0fe!important; }
                    .color-demo-light.glow { box-shadow:0 0 40px currentColor; }
                    @media(max-width:768px){
                        .cw-dot{width:24px;height:24px;font-size:11px;}
                        .cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}
                        .color-learn-grid{grid-template-columns:repeat(4,1fr)!important;gap:6px;}
                        .color-learn-card{padding:8px 4px;}
                    }
                    @media(max-width:480px){
                        .cw-dot{width:20px;height:20px;font-size:10px;}
                        .cw-dots-row{gap:5px;}
                        .cw-nav-bottom{gap:6px;flex-wrap:wrap;}
                        .cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}
                        .cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}
                        .color-learn-grid{grid-template-columns:repeat(2,1fr)!important;gap:6px;}
                        .color-learn-card{padding:8px 4px;border-radius:12px;}
                        .color-demo-light{width:70px!important;height:70px!important;line-height:70px!important;font-size:28px!important;}
                        .react-act-btn{padding:10px 12px!important;font-size:13px!important;}
                        .cw-page-label{font-size:11px;}
                        .cprog-btn{padding:6px 8px!important;font-size:10px!important;}
                    }
                </style>
                ${renderPageNav()}
                <div class="cw-content" id="cwContent">${renderPageContent(0)}</div>
                <div class="cw-nav-bottom">
                    <button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button>
                    <span class="cw-indicator" id="cwIndicator">1/${totalPages}</span>
                    <button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button>
                </div>
            `;
        }

        const html = buildHTML();
        const result = wrap('颜色传感器大冒险', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent');
                const cwPrevBtn = container.querySelector('#cwPrevBtn');
                const cwNextBtn = container.querySelector('#cwNextBtn');
                const cwIndicator = container.querySelector('#cwIndicator');

                function updateNavUI() {
                    container.querySelectorAll('.cw-dot').forEach((d,i) => {
                        d.className = 'cw-dot ' + (i===currentPage?'active':(i<currentPage?'done':''));
                        d.textContent = i<currentPage?'✓':(i+1);
                    });
                    const bar = container.querySelector('.cw-progress-fill');
                    if (bar) bar.style.width = ((currentPage+1)/totalPages*100)+'%';
                    const label = container.querySelector('.cw-page-label');
                    if (label) label.textContent = pageTitles[currentPage];
                    cwPrevBtn.disabled = currentPage === 0;
                    if (currentPage >= totalPages-1) {
                        cwNextBtn.textContent = '🎉 完成课程';
                        cwNextBtn.className = 'sim-btn sim-btn-success';
                    } else {
                        cwNextBtn.textContent = '下一页 →';
                        cwNextBtn.className = 'sim-btn sim-btn-primary';
                    }
                    cwIndicator.textContent = (currentPage+1)+'/'+totalPages;
                }

                function stopReactTimers() {
                    reactActive = false;
                    if (reactInterval) clearInterval(reactInterval);
                    if (reactTimer) clearTimeout(reactTimer);
                }

                function goToPage(n) {
                    if (n<0||n>=totalPages) return;
                    stopReactTimers();
                    if (currentPage === 3) progActive = false;
                    currentPage = n;
                    cwContent.innerHTML = renderPageContent(n);
                    updateNavUI();
                    bindPageEvents(n);
                }

                function bindPageEvents(n) {
                    if (n === 1) bindLearnPage();
                    if (n === 2) bindReactionPage();
                    if (n === 3) bindColorProgPage();
                    if (n === 4) bindFinalQuizPage();
                }

                function bindLearnPage() {
                    const demoLight = container.querySelector('#demoLight');
                    const demoCarState = container.querySelector('#demoCarState');
                    const learnInfo = container.querySelector('#learnInfo');
                    container.querySelectorAll('[data-clr]').forEach(card => {
                        card.onclick = function() {
                            const cn = this.dataset.clr;
                            const cd = colors.find(c => c.name===cn);
                            container.querySelectorAll('[data-clr]').forEach(c => c.classList.remove('selected'));
                            this.classList.add('selected');
                            if (demoLight) { demoLight.style.background=cd.hex; demoLight.textContent=cd.emoji; demoLight.classList.add('glow'); demoLight.style.boxShadow='0 0 40px '+cd.hex; }
                            if (demoCarState) { demoCarState.textContent=cd.actionIcon+' '+cd.action; demoCarState.style.color=cd.hex; }
                            if (learnInfo) learnInfo.innerHTML = '<strong>'+cd.emoji+' '+cd.name+'光 → '+cd.actionIcon+' '+cd.action+'</strong><br><span style="color:#4a3a2a;">'+cd.desc+'</span>';
                            setTimeout(()=>{if(demoLight){demoLight.classList.remove('glow');demoLight.style.boxShadow='0 0 0 rgba(0,0,0,0)';}},800);
                            toast('📖 '+cd.emoji+' = '+cd.action);
                        };
                    });
                }

                function bindReactionPage() {
                    const reactLight = container.querySelector('#reactLight');
                    const reactTimerBar = container.querySelector('#reactTimerBar');
                    const reactScoreEl = container.querySelector('#reactScore');
                    const reactRoundEl = container.querySelector('#reactRound');
                    const reactStreakEl = container.querySelector('#reactStreak');
                    const reactFeedback = container.querySelector('#reactFeedback');
                    const reactStartBtn = container.querySelector('#reactStartBtn');
                    reactScore=0; reactRound=0; streak=0; reactActive=false;

                    function nextReaction() {
                        if (reactRound >= 8) {
                            stopReactTimers();
                            if (reactLight) { reactLight.style.background='#ddd'; reactLight.textContent='🎯'; }
                            if (reactTimerBar) reactTimerBar.style.width='100%';
                            if (reactFeedback) {
                                if (reactScore>=7) reactFeedback.innerHTML = celebrationHTML('太厉害了！','颜色反应满分达人！🏆','🏆');
                                else if (reactScore>=5) reactFeedback.innerHTML = '<span style="color:#5cb85c;">👍 不错！得分 '+reactScore+'/8</span>';
                                else reactFeedback.innerHTML = '<span style="color:#e67e22;">💪 得分 '+reactScore+'/8，去颜色学习页复习下~</span>';
                            }
                            if (reactStartBtn) reactStartBtn.textContent = '🔄 再来一次';
                            return;
                        }
                        reactRound++;
                        reactColor = colors[Math.floor(Math.random()*colors.length)];
                        if (reactLight) { reactLight.style.background=reactColor.hex; reactLight.textContent=reactColor.emoji; reactLight.classList.add('glow'); reactLight.style.boxShadow='0 0 50px '+reactColor.hex; }
                        if (reactRoundEl) reactRoundEl.textContent = reactRound+'/8';
                        reactActive=true; timeLeft=3000;
                        if (reactTimerBar) reactTimerBar.style.width='100%';
                        reactInterval = setInterval(()=>{
                            timeLeft-=100;
                            if (reactTimerBar) reactTimerBar.style.width=(timeLeft/3000*100)+'%';
                            if (timeLeft<=0) {
                                stopReactTimers();
                                if (reactFeedback) reactFeedback.innerHTML = '<span style="color:#e74c3c;">⏰ 时间到！'+reactColor.name+' → '+correctMap[reactColor.name]+'</span>';
                                streak=0; if (reactStreakEl) reactStreakEl.textContent='';
                                if (reactLight) { reactLight.classList.remove('glow'); reactLight.style.boxShadow='0 0 0 rgba(0,0,0,0)'; }
                                reactTimer = setTimeout(nextReaction, 1500);
                            }
                        }, 100);
                    }

                    container.querySelectorAll('.react-act-btn').forEach(btn => {
                        btn.onclick = function() {
                            if (!reactActive) { toast('👆 请先开始挑战'); return; }
                            stopReactTimers();
                            const ans = this.dataset.act;
                            if (ans === correctMap[reactColor.name]) {
                                reactScore++; streak++;
                                if (reactScoreEl) reactScoreEl.textContent = reactScore;
                                if (reactFeedback) reactFeedback.innerHTML = '<span style="color:#5cb85c;">✅ 正确！+1分 | 用时 '+((3000-timeLeft)/1000).toFixed(1)+'秒</span>';
                                if (reactStreakEl) reactStreakEl.textContent = streak>=3?'🔥 '+streak+'连对！':'';
                                toast('✅ 正确！');
                            } else {
                                streak=0; if (reactStreakEl) reactStreakEl.textContent='';
                                if (reactFeedback) reactFeedback.innerHTML = '<span style="color:#e74c3c;">❌ 错误！'+reactColor.name+'应该「'+correctMap[reactColor.name]+'」</span>';
                                toast('❌ 再想想~');
                            }
                            if (reactLight) { reactLight.classList.remove('glow'); reactLight.style.boxShadow='0 0 0 rgba(0,0,0,0)'; }
                            reactTimer = setTimeout(nextReaction, 1200);
                        };
                    });

                    if (reactStartBtn) reactStartBtn.onclick = function() {
                        stopReactTimers(); reactScore=0; reactRound=0; streak=0;
                        if(reactScoreEl)reactScoreEl.textContent='0';
                        if(reactRoundEl)reactRoundEl.textContent='0/8';
                        if(reactStreakEl)reactStreakEl.textContent='';
                        if(reactFeedback)reactFeedback.innerHTML='';
                        this.textContent='⏳ 挑战中...';
                        nextReaction();
                    };
                    const resetBtn = container.querySelector('#reactResetBtn');
                    if (resetBtn) resetBtn.onclick = function() {
                        stopReactTimers(); reactScore=0; reactRound=0; streak=0;
                        if(reactScoreEl)reactScoreEl.textContent='0';
                        if(reactRoundEl)reactRoundEl.textContent='0/8';
                        if(reactStreakEl)reactStreakEl.textContent='';
                        if(reactFeedback)reactFeedback.innerHTML='';
                        if(reactLight){reactLight.style.background='#ddd';reactLight.textContent='🎯';}
                        if(reactTimerBar)reactTimerBar.style.width='100%';
                        if(reactStartBtn)reactStartBtn.textContent='🎮 开始挑战';
                        toast('🔄 已重置');
                    };
                }

                function bindColorProgPage() {
                    const colorMiniCar = container.querySelector('#colorMiniCar');
                    const colorProgSlots = container.querySelector('#colorProgSlots');
                    const colorProgMsg = container.querySelector('#colorProgMsg');
                    colorProg=[]; progActive=false; simCarX=150; simCarY=80;

                    function updateProgUI() {
                        if (!colorProgSlots) return;
                        if (colorProg.length===0) {
                            colorProgSlots.innerHTML='<span style="color:#d0c4b4;font-size:12px;">点击颜色按钮添加...</span>';
                        } else {
                            colorProgSlots.innerHTML = colorProg.map((cmd,i)=>{
                                const c=colors.find(cc=>cc.action===cmd);
                                return '<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#f0ede4;border-radius:16px;font-size:12px;font-weight:600;margin:2px;">'+c.emoji+' '+c.action+'</span>';
                            }).join('');
                        }
                    }

                    container.querySelectorAll('.cprog-btn').forEach(btn => {
                        btn.onclick = function() {
                            if (progActive) { toast('⏸️ 程序运行中'); return; }
                            if (colorProg.length>=10) { toast('⚠️ 最多10步'); return; }
                            colorProg.push(this.dataset.cprog);
                            updateProgUI();
                        };
                    });

                    const runBtn = container.querySelector('#colorProgRunBtn');
                    const clearBtn = container.querySelector('#colorProgClearBtn');
                    const resetBtn = container.querySelector('#colorProgResetBtn');

                    if (runBtn) runBtn.onclick = function() {
                        if (progActive) return;
                        if (colorProg.length===0) { toast('⚠️ 请先添加颜色指令'); return; }
                        progActive=true;
                        if (colorProgMsg) colorProgMsg.innerHTML='<span style="color:#4a90d9;">⏳ 程序运行中...</span>';
                        simCarX=150; simCarY=80;
                        if (colorMiniCar) { colorMiniCar.style.left=(simCarX-14)+'px'; colorMiniCar.style.top=(simCarY-20)+'px'; }
                        let idx=0;
                        function runColorProg() {
                            if (!progActive || idx>=colorProg.length) {
                                progActive=false;
                                if (colorProgMsg) colorProgMsg.innerHTML='<span style="color:#5cb85c;">✅ 程序执行完毕！</span>';
                                toast('✅ 程序执行完成！');
                                return;
                            }
                            const cmd=colorProg[idx], step=22;
                            if(cmd==='前进')simCarX=Math.min(280,simCarX+step);
                            else if(cmd==='后退')simCarX=Math.max(10,simCarX-step);
                            else if(cmd==='左转')simCarY=Math.max(20,simCarY-step);
                            else if(cmd==='右转')simCarY=Math.min(80,simCarY+step);
                            if(colorMiniCar){colorMiniCar.style.left=(simCarX-14)+'px';colorMiniCar.style.top=(simCarY-20)+'px';}
                            const cd=colors.find(c=>c.action===cmd);
                            if(colorProgMsg)colorProgMsg.innerHTML='<span style="color:'+cd.hex+';">执行第'+(idx+1)+'步：'+cd.emoji+' '+cd.action+'</span>';
                            idx++; setTimeout(runColorProg, 500);
                        }
                        runColorProg();
                    };
                    if (clearBtn) clearBtn.onclick = function() { if(!progActive){colorProg=[];updateProgUI();if(colorProgMsg)colorProgMsg.innerHTML='';toast('🗑️ 已清除');} };
                    if (resetBtn) resetBtn.onclick = function() {
                        progActive=false; colorProg=[]; simCarX=150; simCarY=80;
                        if(colorMiniCar){colorMiniCar.style.left=(simCarX-14)+'px';colorMiniCar.style.top=(simCarY-20)+'px';}
                        updateProgUI(); if(colorProgMsg)colorProgMsg.innerHTML=''; toast('🔄 已重置');
                    };
                    updateProgUI();
                }

                function bindFinalQuizPage() {
                    const finalEmoji = container.querySelector('#finalEmoji');
                    const finalQuestion = container.querySelector('#finalQuestion');
                    const finalOptions = container.querySelector('#finalOptions');
                    const finalFeedback = container.querySelector('#finalFeedback');
                    const finalScore = container.querySelector('#finalScore');
                    const finalStartBtn = container.querySelector('#finalStartBtn');
                    let fScore=0, fRound=0, fActive=false;

                    const finalQuiz = [
                        { q:'红色传感器亮起，小车应该？', opts:['前进','停止','左转','右转'], ans:1, emoji:'🔴', hint:'红色=红灯=停下来' },
                        { q:'想让小车左转，应该给它看什么颜色？', opts:['红色','绿色','蓝色','黄色'], ans:2, emoji:'🔵', hint:'蓝色=向左拐' },
                        { q:'绿色在颜色规则中代表什么？', opts:['停止','左转','右转','前进'], ans:3, emoji:'🟢', hint:'绿灯行，前进！' },
                        { q:'黄色传感器亮了，小车会？', opts:['前进','后退','左转','右转'], ans:3, emoji:'🟡', hint:'黄色=向右拐' },
                        { q:'哪个颜色代表"停止"？', opts:['黄色','绿色','红色','蓝色'], ans:2, emoji:'🔴', hint:'红色像红灯' },
                        { q:'颜色传感器是机器人的什么？', opts:['大脑','肌肉','眼睛','耳朵'], ans:2, emoji:'👁️', hint:'它让机器人"看见"颜色' }
                    ];

                    function nextFinalQ() {
                        if (fRound>=6) {
                            if(finalEmoji)finalEmoji.textContent=fScore>=5?'🏆':fScore>=3?'😊':'💪';
                            if(finalQuestion)finalQuestion.textContent=fScore>=5?'你是颜色大师！全部通关！':'再复习一下颜色规则吧~';
                            if(finalOptions)finalOptions.innerHTML='';
                            if(finalFeedback)finalFeedback.innerHTML=starBadge(fScore,6)+'<br><span style="font-size:14px;">'+fScore+'/6 分</span>';
                            fActive=false;
                            if(finalStartBtn)finalStartBtn.textContent='🔄 再来一次';
                            if(fScore>=5)toast('🏆 综合闯关成功！');
                            return;
                        }
                        const q=finalQuiz[fRound]; fRound++;
                        if(finalEmoji)finalEmoji.textContent=q.emoji;
                        if(finalQuestion)finalQuestion.textContent='第'+fRound+'题：'+q.q;
                        if(finalOptions)finalOptions.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-fopt="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');
                        if(finalFeedback)finalFeedback.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';
                        fActive=true;
                        if(finalOptions){finalOptions.querySelectorAll('[data-fopt]').forEach(btn=>{btn.onclick=function(){
                            if(!fActive)return;fActive=false;
                            const ans=parseInt(this.dataset.fopt);
                            finalOptions.querySelectorAll('[data-fopt]').forEach(b=>b.disabled=true);
                            if(ans===q.ans){fScore++;if(finalScore)finalScore.textContent=fScore;if(finalFeedback)finalFeedback.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}
                            else{if(finalFeedback)finalFeedback.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}
                            setTimeout(nextFinalQ,1500);
                        };})}
                    }

                    if(finalStartBtn)finalStartBtn.onclick=function(){fScore=0;fRound=0;if(finalScore)finalScore.textContent='0';if(finalFeedback)finalFeedback.innerHTML='';nextFinalQ();this.textContent='⏳ 答题中...';};
                    const fResetBtn=container.querySelector('#finalResetBtn');
                    if(fResetBtn)fResetBtn.onclick=function(){fActive=false;fScore=0;fRound=0;if(finalScore)finalScore.textContent='0';if(finalEmoji)finalEmoji.textContent='🏆';if(finalQuestion)finalQuestion.textContent='准备好了吗？综合闯关！';if(finalOptions)finalOptions.innerHTML='';if(finalFeedback)finalFeedback.innerHTML='';if(finalStartBtn)finalStartBtn.textContent='🎮 开始闯关';toast('🔄 已重置');};
                }

                cwPrevBtn.addEventListener('click', () => { if (currentPage>0) goToPage(currentPage-1); });
                cwNextBtn.addEventListener('click', () => {
                    if (currentPage >= totalPages-1) { toast('🎉 恭喜完成第四课！R01课程全部完成！'); }
                    else { goToPage(currentPage+1); }
                });
                container.querySelectorAll('.cw-dot').forEach(dot => {
                    dot.addEventListener('click', function() {
                        const target = parseInt(this.dataset.goto);
                        if (target <= currentPage || target === currentPage + 1) goToPage(target);
                    });
                });
                updateNavUI();
            }
        };
    };

    // ============================================================
    //  R02: 声音魔法师 — 5页线上课件
    // ============================================================

    registry['2-1'] = function() {
        let currentPage = 0;
        const totalPages = 5;
        const pageTitles = ['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'];
        let quizScore = 0, quizRound = 0, quizActive = false;

        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${i<currentPage?'✓':(i+1)}</span>`;
            }
            return `
                <div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div>
                <div class="cw-dots-row">${dots}</div>
                <div class="cw-page-label">${pageTitles[currentPage]}</div>
            `;
        }

        function renderPageContent(n) {
            switch(n) {
                case 0: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🔊','欢迎来到声音世界！','声音是一种神奇的信号，机器人也能"听"到声音！')}
                        <div style="text-align:center;margin:16px 0;">
                            <div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🔊</div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;">
                            <p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">
                                🔊 拍拍手、喊一声、弹一下琴——<br>这些都是在发出<strong style="color:#1a2a6c;">声音信号</strong>！<br>
                                机器人有<strong style="color:#e67e22;">声音传感器</strong>，<br>就像人的<strong>耳朵</strong>一样可以"听"到声音！
                            </p>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.6;">
                                你能想到哪些<strong>用声音控制</strong>的东西？<br>
                                💡 提示：声控灯、语音助手...
                            </div>
                        </div>
                    </div>`;
                case 1: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🧠','声音是什么？','声音是一种"信号"——有大小、有高低、有长短')}
                        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">
                            <div class="cw-info-card" style="--cc:#e74c3c"><div style="font-size:36px;">📢</div><div style="font-size:15px;font-weight:800;color:#922b21;">音量</div><div style="font-size:11px;color:#4a3a2a;">声音的大小<br>单位：分贝(dB)</div></div>
                            <div class="cw-info-card" style="--cc:#4a90d9"><div style="font-size:36px;">🎵</div><div style="font-size:15px;font-weight:800;color:#1a5276;">音调</div><div style="font-size:11px;color:#4a3a2a;">声音的高低<br>单位：赫兹(Hz)</div></div>
                            <div class="cw-info-card" style="--cc:#5cb85c"><div style="font-size:36px;">🎸</div><div style="font-size:15px;font-weight:800;color:#1a6e3a;">音色</div><div style="font-size:11px;color:#4a3a2a;">声音的特色<br>区分不同乐器</div></div>
                        </div>
                        <div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🔑 声音传感器的工作原理</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:1.8;text-align:center;">
                                🔊 声音 → 🎤 <strong>传感器接收</strong> → ⚡ <strong>转换成电信号</strong> → 🧠 <strong>控制器读取音量值</strong>
                            </div>
                        </div>
                        <div style="text-align:center;padding:8px;background:#f0ede4;border-radius:12px;font-size:12px;color:#7a6a5a;">
                            💡 声音<strong>越大</strong>，信号<strong>越强</strong>，传感器读数<strong>越高</strong>！
                        </div>
                    </div>`;
                case 2: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🔬','动手实验：声音传感器','模拟声音传感器，检测不同音量变化')}
                        <div style="text-align:center;margin-bottom:14px;">
                            <div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:20px;">
                                <div style="font-size:48px;transition:all .2s;" id="soundIcon">🔊</div>
                                <div style="margin-top:8px;"><span class="sim-label">当前音量：</span><span class="sim-value" id="volumeLevel">0 dB</span></div>
                                <div class="sim-progress" style="width:200px;margin:8px auto;">
                                    <div class="sim-progress-bar" id="volumeBar" style="width:0%;background:linear-gradient(90deg,#5cb85c,#f1c40f,#e74c3c);"></div>
                                </div>
                                <div style="font-size:12px;color:#7a6a5a;margin-top:4px;" id="volumeLabel">等待检测...</div>
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
                    </div>`;
                case 3: return `
                    <div class="cw-page-inner">
                        ${sectionTitle('🏆','声音知识闯关','检验你对声音和传感器的了解！')}
                        <div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;">
                            <div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div>
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div>
                            <div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div>
                        </div>
                        <div style="display:flex;gap:12px;justify-content:center;margin-top:10px;">
                            <span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span>
                        </div>
                        <div class="sim-controls" style="justify-content:center;">
                            <button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button>
                            <button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button>
                        </div>
                    </div>`;
                case 4: return `
                    <div class="cw-page-inner">
                        ${celebrationHTML('声音探秘家！','你认识了声音传感器，理解了声音是一种信号！','🔊')}
                        <div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;">
                            <div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div>
                            <div style="font-size:13px;color:#4a3a2a;line-height:2;">
                                ✅ <strong>声音是一种信号</strong>，可以被传感器检测<br>
                                ✅ 声音的<strong>三要素</strong>：音量、音调、音色<br>
                                ✅ <strong>音量单位</strong>是分贝(dB)，越大声分贝越高<br>
                                ✅ 声音传感器就像机器人的<strong>"耳朵"</strong><br>
                                ✅ 声音传感器把声波变成<strong>电信号</strong>传给控制器
                            </div>
                        </div>
                        <div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;">
                            <div style="font-size:28px;margin-bottom:4px;">🌟</div>
                            <div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div>
                            <div style="font-size:13px;color:#4a3a2a;">我们要<strong>用声音控制机器人</strong>！拍拍手，小车就跑！🎤🤖</div>
                        </div>
                    </div>`;
                default: return '';
            }
        }

        function buildHTML() {
            return `
                <style>
                    .cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}
                    .cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}
                    .cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}
                    .cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}
                    .cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}
                    .cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}
                    .cw-dot:hover:not(.active){border-color:#4a90d9;}
                    .cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}
                    @keyframes cwFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
                    .cw-page-inner{animation:cwFadeIn .35s ease-out;}
                    .cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}
                    .cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}
                    .cw-nav-bottom button{min-width:90px;}
                    .cw-info-card{background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;transition:all .2s;min-width:90px;flex:1;}
                    .cw-info-card:hover{border-color:var(--cc,#4a90d9);transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.08);}
                    @media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}.cw-info-card{min-width:70px;padding:10px 6px;}}
                    @media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}
                </style>
                ${renderPageNav()}
                <div class="cw-content" id="cwContent">${renderPageContent(0)}</div>
                <div class="cw-nav-bottom">
                    <button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button>
                    <span class="cw-indicator" id="cwIndicator">1/${totalPages}</span>
                    <button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button>
                </div>
            `;
        }

        const html = buildHTML();
        const result = wrap('声音探索家 — 声音信号检测', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent');
                const cwPrevBtn = container.querySelector('#cwPrevBtn');
                const cwNextBtn = container.querySelector('#cwNextBtn');
                const cwIndicator = container.querySelector('#cwIndicator');

                function updateNavUI() {
                    container.querySelectorAll('.cw-dot').forEach((d,i) => {
                        d.className = 'cw-dot ' + (i===currentPage?'active':(i<currentPage?'done':''));
                        d.textContent = i<currentPage?'✓':(i+1);
                    });
                    const bar = container.querySelector('.cw-progress-fill');
                    if (bar) bar.style.width = ((currentPage+1)/totalPages*100)+'%';
                    const label = container.querySelector('.cw-page-label');
                    if (label) label.textContent = pageTitles[currentPage];
                    cwPrevBtn.disabled = currentPage === 0;
                    if (currentPage >= totalPages-1) {
                        cwNextBtn.textContent = '🎉 完成课程';
                        cwNextBtn.className = 'sim-btn sim-btn-success';
                    } else {
                        cwNextBtn.textContent = '下一页 →';
                        cwNextBtn.className = 'sim-btn sim-btn-primary';
                    }
                    cwIndicator.textContent = (currentPage+1)+'/'+totalPages;
                }

                function goToPage(n) {
                    if (n<0||n>=totalPages) return;
                    currentPage = n;
                    cwContent.innerHTML = renderPageContent(n);
                    updateNavUI();
                    bindPageEvents(n);
                }

                function bindPageEvents(n) {
                    if (n === 2) bindLabPage();
                    if (n === 3) bindQuizPage();
                }

                function bindLabPage() {
                    const volumeBar = container.querySelector('#volumeBar');
                    const volumeLevel = container.querySelector('#volumeLevel');
                    const volumeLabel = container.querySelector('#volumeLabel');
                    const soundIcon = container.querySelector('#soundIcon');
                    const soundLog = container.querySelector('#soundLog');
                    function log(msg) { const t=new Date().toLocaleTimeString(); soundLog.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>'; soundLog.scrollTop=soundLog.scrollHeight; }
                    function setVolume(level, label) {
                        volumeBar.style.width=level+'%'; volumeLevel.textContent=level+' dB';
                        volumeLabel.textContent=label; soundIcon.style.fontSize=(20+level*0.6)+'px';
                        log('检测到声音：'+level+'dB ('+label+')');
                        if (level>70) toast('📢 声音很大！'); else if (level>40) toast('🔊 正常音量');
                    }
                    container.querySelector('#makeSoundBtn').onclick=function(){setVolume(Math.round(30+Math.random()*30),'说话声 🗣️');};
                    container.querySelector('#loudSoundBtn').onclick=function(){setVolume(Math.round(70+Math.random()*25),'喊叫声 📢');};
                    container.querySelector('#quietBtn').onclick=function(){setVolume(Math.round(5+Math.random()*10),'安静环境 🤫');};
                }

                function bindQuizPage() {
                    quizScore=0; quizRound=0; quizActive=false;
                    const qzEmoji=container.querySelector('#qzEmoji'), qzQuestion=container.querySelector('#qzQuestion');
                    const qzOptions=container.querySelector('#qzOptions'), qzFeedback=container.querySelector('#qzFeedback');
                    const qzScore=container.querySelector('#qzScore'), qzStartBtn=container.querySelector('#qzStartBtn');
                    const bank=[
                        {q:'声音传感器就像机器人的什么？',opts:['眼睛','耳朵','嘴巴','手'],ans:1,emoji:'👂',hint:'它用来"听"声音'},
                        {q:'音量的单位是什么？',opts:['厘米','千克','分贝(dB)','赫兹(Hz)'],ans:2,emoji:'📏',hint:'声音大小用分贝衡量'},
                        {q:'声音越大，传感器读数会？',opts:['不变','越低','越高','消失'],ans:2,emoji:'📈',hint:'声音越大=信号越强'},
                        {q:'以下哪个声音分贝最高？',opts:['轻声细语','正常说话','大声喊叫','安静教室'],ans:2,emoji:'📢',hint:'喊叫声最响亮'},
                        {q:'声音传感器把声波转换成什么？',opts:['光信号','电信号','水信号','风信号'],ans:1,emoji:'⚡',hint:'变成电信号传给控制器'}
                    ];
                    function nextQ() {
                        if (quizRound>=5) {
                            if(qzEmoji)qzEmoji.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';
                            if(qzQuestion)qzQuestion.textContent=quizScore>=4?'声音小专家！':quizScore>=3?'不错！':'再复习一下吧~';
                            if(qzOptions)qzOptions.innerHTML='';
                            if(qzFeedback)qzFeedback.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';
                            quizActive=false; if(qzStartBtn)qzStartBtn.textContent='🔄 再来一次';
                            if(quizScore>=4)toast('🏆 闯关成功！');
                            return;
                        }
                        const q=bank[quizRound]; quizRound++;
                        if(qzEmoji)qzEmoji.textContent=q.emoji;
                        if(qzQuestion)qzQuestion.textContent='第'+quizRound+'题：'+q.q;
                        if(qzOptions)qzOptions.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qopt="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');
                        if(qzFeedback)qzFeedback.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';
                        quizActive=true;
                        if(qzOptions){qzOptions.querySelectorAll('[data-qopt]').forEach(btn=>{btn.onclick=function(){
                            if(!quizActive)return;quizActive=false;
                            const ans=parseInt(this.dataset.qopt);
                            qzOptions.querySelectorAll('[data-qopt]').forEach(b=>b.disabled=true);
                            if(ans===q.ans){quizScore++;if(qzScore)qzScore.textContent=quizScore;if(qzFeedback)qzFeedback.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}
                            else{if(qzFeedback)qzFeedback.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}
                            setTimeout(nextQ,1500);
                        };})}
                    }
                    if(qzStartBtn)qzStartBtn.onclick=function(){quizScore=0;quizRound=0;if(qzScore)qzScore.textContent='0';if(qzFeedback)qzFeedback.innerHTML='';nextQ();this.textContent='⏳ 答题中...';};
                    const qzResetBtn=container.querySelector('#qzResetBtn');
                    if(qzResetBtn)qzResetBtn.onclick=function(){quizActive=false;quizScore=0;quizRound=0;if(qzScore)qzScore.textContent='0';if(qzEmoji)qzEmoji.textContent='🎯';if(qzQuestion)qzQuestion.textContent='准备开始挑战！';if(qzOptions)qzOptions.innerHTML='';if(qzFeedback)qzFeedback.innerHTML='';if(qzStartBtn)qzStartBtn.textContent='🎮 开始闯关';toast('🔄 已重置');};
                }

                cwPrevBtn.addEventListener('click', () => { if (currentPage>0) goToPage(currentPage-1); });
                cwNextBtn.addEventListener('click', () => { if (currentPage>=totalPages-1) toast('🎉 恭喜完成！'); else goToPage(currentPage+1); });
                container.querySelectorAll('.cw-dot').forEach(dot => { dot.addEventListener('click', function() { const t=parseInt(this.dataset.goto); if(t<=currentPage||t===currentPage+1) goToPage(t); }); });
                updateNavUI();
            }
        };
    };

    registry['2-2'] = function() {
        let currentPage = 0;
        const totalPages = 5;
        const pageTitles = ['📖 场景引入','🧠 知识探索','🕹️ 动手实验','🏆 闯关挑战','🎉 课堂小结'];
        let quizScore = 0;
        function renderPageNav() {
            let dots = '';
            for (let i=0;i<totalPages;i++) {
                const cls = i===currentPage?'active':(i<currentPage?'done':'');
                dots += `<span class="cw-dot ${cls}" data-goto="${i}">${i<currentPage?'✓':(i+1)}</span>`;
            }
            return `<div class="cw-progress"><div class="cw-progress-fill" style="width:${(currentPage+1)/totalPages*100}%"></div></div><div class="cw-dots-row">${dots}</div><div class="cw-page-label">${pageTitles[currentPage]}</div>`;
        }
        function renderPageContent(n) {
            switch(n) {
                case 0: return `<div class="cw-page-inner">${sectionTitle('🎤','声控机器人','拍拍手，小车跑！喊一声，小车停！声音可以控制机器人！')}<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🎤🤖</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">👏 <strong>拍一下手</strong> → 小车前进！<br>✋ <strong>喊一声"停"</strong> → 小车停止！<br>这就是<strong style="color:#1a2a6c;">声控机器人</strong>的魔法！<br>声音传感器听到声音后告诉控制器，控制器再指挥马达行动。</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">如果机器人对<strong>所有声音</strong>都反应，会发生什么？<br>💡 提示：教室里一直有人说话...</div></div></div>`;
                case 1: return `<div class="cw-page-inner">${sectionTitle('🧠','声音阈值','设定一个"门槛"，超过它机器人才会行动')}<div style="text-align:center;margin:12px 0;"><div style="display:inline-block;padding:12px 24px;background:#f0ede4;border-radius:20px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🎯 阈值 = 触发门槛</div><div style="display:flex;align-items:center;gap:12px;justify-content:center;"><div style="text-align:center;padding:10px;background:#fadbd8;border-radius:12px;font-size:12px;">🤫 小声<br><strong style="color:#e74c3c;">30dB</strong><br>❌ 不触发</div><div style="font-size:24px;color:#7a6a5a;">→</div><div style="text-align:center;padding:10px;background:#e8e0d5;border-radius:12px;font-size:12px;">🚦 阈值<br><strong>40dB</strong></div><div style="font-size:24px;color:#7a6a5a;">→</div><div style="text-align:center;padding:10px;background:#d5f5e3;border-radius:12px;font-size:12px;">📢 大声<br><strong style="color:#5cb85c;">60dB</strong><br>✅ 触发！</div></div></div></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🔑 为什么需要阈值？</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">如果<strong>没有阈值</strong>，任何小声音都会触发机器人——<br>它会<strong>乱动不止</strong>！设定阈值就像给机器人装了一个<strong>"过滤器"</strong>，只有够大的声音才能指挥它。</div></div></div>`;
                case 2: return `<div class="cw-page-inner">${sectionTitle('🕹️','动手实验：声控小车','设定阈值，用声音控制机器人前进')}<div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:14px;"><div style="text-align:center;"><div class="sim-robot"><div class="sim-robot-body" id="voiceRobot" style="background:#4a90d9;"><div class="sim-robot-eye sim-robot-eye-left pupil"></div><div class="sim-robot-eye sim-robot-eye-right pupil"></div><div class="sim-robot-wheel sim-robot-wheel-left"></div><div class="sim-robot-wheel sim-robot-wheel-right"></div></div></div><div style="margin-top:8px;font-size:13px;font-weight:600;color:#4a3a2a;" id="robotState">⏹ 等待指令</div></div><div style="text-align:left;padding:12px;background:#f0ede4;border-radius:12px;"><div class="sim-label">🎯 阈值设定</div><input type="range" class="sim-slider" id="thresholdSlider" min="10" max="90" value="40" style="width:160px;"><div><span class="sim-value" id="thresholdDisplay">40</span> <span style="font-size:13px;color:#7a6a5a;">dB</span></div><div style="margin-top:8px;font-size:12px;color:#7a6a5a;">超过阈值 → 机器人前进</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-primary" id="voiceCmdBtn">🔊 发出指令 (超过阈值)</button><button class="sim-btn sim-btn-outline" id="quietCmdBtn">🤫 轻声 (低于阈值)</button></div><div id="voiceLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">🎤 声控系统就绪...</div></div>`;
                case 3: return `<div class="cw-page-inner">${sectionTitle('🏆','声控知识闯关','检验你对声控原理的理解！')}<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>`;
                case 4: return `<div class="cw-page-inner">${celebrationHTML('声控大师！','你学会了用声音控制机器人！','🎤')}<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ <strong>声音阈值</strong>是触发机器人动作的"门槛"<br>✅ 超过阈值 → 机器人<strong>执行动作</strong><br>✅ 低于阈值 → 机器人<strong>忽略不执行</strong><br>✅ 阈值可以<strong>调节</strong>，适应不同环境<br>✅ 声控 = 声音传感器 + 控制器 + 马达的<strong>联动</strong></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们要用<strong>蜂鸣器演奏音乐</strong>！🎵 机器人也能当音乐家！</div></div></div>`;
                default: return '';
            }
        }
        function buildHTML() {
            return `<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}@keyframes cwFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>${renderPageNav()}<div class="cw-content" id="cwContent">${renderPageContent(0)}</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/${totalPages}</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>`;
        }
        const html = buildHTML();
        const result = wrap('声控编程师 — 口令控制机器人', html);
        return {
            html: result,
            init: function(container) {
                const cwContent = container.querySelector('#cwContent'), cwPrevBtn = container.querySelector('#cwPrevBtn'), cwNextBtn = container.querySelector('#cwNextBtn'), cwIndicator = container.querySelector('#cwIndicator');
                function updateNavUI() {
                    container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});
                    const bar=container.querySelector('.cw-progress-fill');if(bar)bar.style.width=((currentPage+1)/totalPages*100)+'%';
                    const label=container.querySelector('.cw-page-label');if(label)label.textContent=pageTitles[currentPage];
                    cwPrevBtn.disabled=currentPage===0;
                    if(currentPage>=totalPages-1){cwNextBtn.textContent='🎉 完成课程';cwNextBtn.className='sim-btn sim-btn-success';}else{cwNextBtn.textContent='下一页 →';cwNextBtn.className='sim-btn sim-btn-primary';}
                    cwIndicator.textContent=(currentPage+1)+'/'+totalPages;
                }
                function goToPage(n){if(n<0||n>=totalPages)return;currentPage=n;cwContent.innerHTML=renderPageContent(n);updateNavUI();bindPageEvents(n);}
                function bindPageEvents(n){if(n===2)bindLabPage();if(n===3)bindQuizPage();}
                function bindLabPage(){
                    const robot=container.querySelector('#voiceRobot'), state=container.querySelector('#robotState'), thresholdSlider=container.querySelector('#thresholdSlider'), thresholdDisplay=container.querySelector('#thresholdDisplay'), voiceLog=container.querySelector('#voiceLog');
                    function log(msg){const t=new Date().toLocaleTimeString();voiceLog.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>';voiceLog.scrollTop=voiceLog.scrollHeight;}
                    thresholdSlider.oninput=function(){thresholdDisplay.textContent=this.value;};
                    container.querySelector('#voiceCmdBtn').onclick=function(){const vol=parseInt(thresholdSlider.value)+10+Math.random()*20;robot.style.animation='simWalk .5s infinite';state.textContent='🚀 前进中...';state.style.color='#5cb85c';log('🎤 声控指令！音量 '+Math.round(vol)+'dB > 阈值 '+thresholdSlider.value+'dB → 前进');toast('🚀 机器人前进！');setTimeout(()=>{robot.style.animation='none';state.textContent='⏹ 指令执行完毕';state.style.color='#4a3a2a';},1500);};
                    container.querySelector('#quietCmdBtn').onclick=function(){const vol=Math.random()*(parseInt(thresholdSlider.value)-5);state.textContent='⏹ 音量不足，未触发';state.style.color='#7a6a5a';log('🤫 音量不足 '+Math.round(vol)+'dB < 阈值 '+thresholdSlider.value+'dB → 无动作');};
                }
                function bindQuizPage(){
                    quizScore=0;let qr=0,qa=false;
                    const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                    const bank=[{q:'声音"阈值"是什么意思？',opts:['声音的颜色','触发动作的门槛','声音的速度','机器人的名字'],ans:1,emoji:'🎯',hint:'阈值=门槛，超过才触发'},{q:'为什么要设定阈值？',opts:['让机器人更漂亮','避免小声音误触发','让声音更好听','增加机器人重量'],ans:1,emoji:'🛡️',hint:'防止环境噪音干扰'},{q:'超过阈值，机器人会？',opts:['不动','执行动作','关机','唱歌'],ans:1,emoji:'🚀',hint:'信号够强就行动'},{q:'低于阈值，机器人会？',opts:['执行动作','忽略不执行','跳舞','倒退'],ans:1,emoji:'🤫',hint:'声音太小，不触发'},{q:'声控机器人的正确链路是？',opts:['马达→控制器→传感器','传感器→控制器→马达','控制器→传感器→马达','传感器→马达→控制器'],ans:1,emoji:'🔗',hint:'先听到→再判断→最后行动'}];
                    function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'声控小专家！':quizScore>=3?'不错！':'再复习一下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                    if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                    const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
                }
                cwPrevBtn.addEventListener('click',()=>{if(currentPage>0)goToPage(currentPage-1);});
                cwNextBtn.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else goToPage(currentPage+1);});
                container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)goToPage(t);});});
                updateNavUI();
            }
        };
    };

    registry['2-3'] = function() {
        const notes = [
            { name:'Do', freq:262, key:'C' },{ name:'Re', freq:294, key:'D' },{ name:'Mi', freq:330, key:'E' },
            { name:'Fa', freq:349, key:'F' },{ name:'Sol', freq:392, key:'G' },{ name:'La', freq:440, key:'A' },{ name:'Si', freq:494, key:'B' }
        ];
        const melody = [
            { note:0, dur:400 },{ note:0, dur:400 },{ note:2, dur:400 },{ note:2, dur:400 },
            { note:4, dur:400 },{ note:4, dur:400 },{ note:2, dur:800 },
            { note:1, dur:400 },{ note:1, dur:400 },{ note:3, dur:400 },{ note:3, dur:400 },
            { note:4, dur:400 },{ note:4, dur:400 },{ note:2, dur:800 }
        ];
        let currentPage = 0, totalPages = 5, pageTitles = ['📖 场景引入','🧠 知识探索','🔬 动手实验','🎶 演奏挑战','🎉 课堂小结'], quizScore = 0, playing = false, timer = null, melodyIdx = 0;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🎵','小小音乐家','机器人也能演奏音乐！秘密就在蜂鸣器里')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🎵🤖</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🎶 音乐是由<strong style="color:#1a2a6c;">不同高低的音符</strong>组成的！<br>机器人身上有一个<strong style="color:#e67e22;">蜂鸣器</strong>，<br>它可以发出<strong>不同频率的声音</strong>——<br>就像钢琴的琴键一样！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">你听过<strong>《小星星》</strong>吗？<br>一闪一闪亮晶晶... 它是用什么音符组成的？</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','认识音符家族','7个音符：Do Re Mi Fa Sol La Si')+'<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+notes.map(n=>'<div class="cw-note-card" style="--nc:'+(n.freq>400?'#e74c3c':n.freq>330?'#e67e22':n.freq>280?'#5cb85c':'#4a90d9')+'"><div style="font-size:28px;font-weight:800;color:#1a2a6c;">'+n.name+'</div><div style="font-size:11px;color:#7a6a5a;">'+n.freq+'Hz</div><div style="font-size:10px;color:#7a6a5a;">键:'+n.key+'</div></div>').join('')+'</div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🔑 频率 = 音调</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">频率越<strong>高</strong> → 音调越<strong>高</strong>（声音越尖）<br>频率越<strong>低</strong> → 音调越<strong>低</strong>（声音越沉）<br>Hz（赫兹）= 每秒振动次数</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：演奏音符','点击音符卡片，蜂鸣器发出对应声音')+'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:14px 28px;background:#f0ede4;border-radius:16px;"><div style="font-size:36px;">🎵</div><div style="font-size:26px;font-weight:800;color:#1a2a6c;font-family:\'Cormorant Garamond\',serif;" id="currentNote">—</div></div></div><div class="sim-grid sim-grid-4" style="margin-bottom:12px;">'+notes.map((n,i)=>'<div class="sim-card" data-note="'+i+'"><div style="font-size:24px;font-weight:800;color:#1a2a6c;font-family:\'Cormorant Garamond\',serif;">'+n.name+'</div><div style="font-size:11px;color:#7a6a5a;">'+n.freq+'Hz</div></div>').join('')+'</div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="playMelodyBtn">🎶 播放《小星星》</button><button class="sim-btn sim-btn-outline" id="stopMelodyBtn">⏹ 停止</button></div><div id="melodyLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">🎼 蜂鸣器就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🎶','演奏挑战：小星星','用蜂鸣器演奏完整的《小星星》旋律')+'<div style="text-align:center;margin:12px 0;"><div style="font-size:16px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">🌟 闪闪一闪亮晶晶</div><div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;font-size:20px;">'+['Do','Do','Sol','Sol','La','La','Sol','—','Fa','Fa','Mi','Mi','Re','Re','Do','—'].map(n=>'<span style="padding:4px 8px;background:'+(n==='—'?'#f0ede4':'#e8f0fe')+';border-radius:8px;font-weight:700;font-size:14px;">'+n+'</span>').join('')+'</div></div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🏆 挑战任务</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">1️⃣ 点击上方音符卡片，<strong>手动弹奏</strong>《小星星》<br>2️⃣ 点击"播放"按钮，听蜂鸣器<strong>自动演奏</strong><br>3️⃣ 注意听每个音符的<strong>高低变化</strong>！</div></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('音乐小天才！','你学会了用蜂鸣器演奏音乐！','🎵')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 认识了<strong>7个音符</strong>：Do Re Mi Fa Sol La Si<br>✅ <strong>频率(Hz)</strong>决定音调高低<br>✅ <strong>蜂鸣器</strong>可以发出不同频率的声音<br>✅ 学会了演奏<strong>《小星星》</strong>的旋律<br>✅ 理解<strong>音乐 = 音符序列</strong></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们要当<strong>剧场导演</strong>！声控+蜂鸣器=互动小剧场！🎭</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}@keyframes cwFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}.cw-note-card{background:#fff;border-radius:14px;padding:10px 12px;text-align:center;border:3px solid #e8e0d5;transition:all .2s;min-width:52px;}.cw-note-card:hover{border-color:var(--nc,#4a90d9);transform:translateY(-3px);}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html = bHTML();
        const result = wrap('音乐编程师 — 蜂鸣器演奏', html);
        return {html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;if(currentPage===2||currentPage===3){playing=false;if(timer)clearTimeout(timer);}currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();}
            function bindLab(){
                const cn=container.querySelector('#currentNote'),ml=container.querySelector('#melodyLog');
                function log(msg){const t=new Date().toLocaleTimeString();ml.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>';ml.scrollTop=ml.scrollHeight;}
                container.querySelectorAll('[data-note]').forEach(el=>{el.onclick=function(){const idx=parseInt(this.dataset.note);const n=notes[idx];cn.textContent=n.name;container.querySelectorAll('[data-note]').forEach(c=>c.classList.remove('selected'));this.classList.add('selected');log('🎵 演奏 '+n.name+' ('+n.freq+'Hz)');toast('🎵 '+n.name);};});
                container.querySelector('#playMelodyBtn').onclick=function(){if(playing)return;playing=true;melodyIdx=0;log('🎶 开始播放《小星星》');function pn(){if(!playing||melodyIdx>=melody.length){playing=false;cn.textContent='✓';log('🎶 播放完成！');toast('🎶 演奏结束！');return;}const m=melody[melodyIdx];const n=notes[m.note];cn.textContent=n.name;container.querySelectorAll('[data-note]').forEach(c=>c.classList.remove('selected'));container.querySelector('[data-note="'+m.note+'"]')?.classList.add('selected');melodyIdx++;timer=setTimeout(pn,m.dur);}pn();};
                container.querySelector('#stopMelodyBtn').onclick=function(){playing=false;if(timer)clearTimeout(timer);cn.textContent='⏹';log('⏹ 播放已停止');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['2-4'] = function() {
        let currentPage = 0, totalPages = 5, pageTitles = ['📖 场景引入','🧠 知识探索','🎬 动手实验','🎨 创意导演','🎉 课堂小结'];
        const scenes = {
            1:{scene:'🌅 清晨',actor:'🤖 机器人伸懒腰醒来',music:'🎵 轻柔的起床音乐',log:'机器人被闹钟唤醒，伸了个懒腰'},
            2:{scene:'💃 舞池',actor:'🤖 机器人欢快跳舞',music:'🎵 动感的舞曲',log:'机器人随着音乐节奏舞动'},
            3:{scene:'🎉 谢幕',actor:'🤖 机器人鞠躬致谢',music:'🎵 隆重的谢幕曲',log:'机器人完成表演，向观众鞠躬'}
        };
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🎭','声控互动剧场','当声音传感器遇上蜂鸣器——机器人也能当演员！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🎭🤖🎵</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🎤 <strong>声音传感器</strong> → 听到指令<br>🎵 <strong>蜂鸣器</strong> → 播放音乐<br>🤖 <strong>机器人</strong> → 表演动作<br>三个组合在一起= <strong style="color:#1a2a6c;">互动小剧场</strong>！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">如果你是导演，你会设计机器人<strong>表演什么</strong>？</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','剧场三大要素','舞台 + 演员 + 音乐 = 精彩表演')+'<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🎭',title:'舞台',desc:'表演的场景和背景',color:'#e67e22'},{icon:'🤖',title:'演员',desc:'机器人执行的动作',color:'#4a90d9'},{icon:'🎵',title:'音乐',desc:'蜂鸣器播放的旋律',color:'#5cb85c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:36px;">'+c.icon+'</div><div style="font-size:14px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:11px;color:#7a6a5a;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔗 联动流程</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">🎤 声音传感器接收指令 → 🧠 控制器判断场景 → 🤖 机器人表演 + 🎵 蜂鸣器配乐</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🎬','动手实验：场景表演','点击场景按钮，导演你的机器人演员！')+'<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:14px;">'+[{k:'sceneDisplay',i:'🎭',l:'舞台'},{k:'actorDisplay',i:'🤖',l:'机器人演员'},{k:'musicDisplay',i:'🎵',l:'背景音乐'}].map(x=>'<div style="text-align:center;padding:14px;background:#f0ede4;border-radius:16px;width:150px;"><div style="font-size:32px;">'+x.i+'</div><div style="font-size:13px;font-weight:600;color:#4a3a2a;">'+x.l+'</div><div style="font-size:12px;color:#7a6a5a;min-height:36px;" id="'+x.k+'">等待开场</div></div>').join('')+'</div><div class="sim-controls" style="justify-content:center;flex-wrap:wrap;">'+Object.entries(scenes).map(([k,v])=>'<button class="sim-btn sim-btn-primary" data-scene="'+k+'" style="margin:4px;">🎬 场景'+k+': '+v.scene.split(' ')[1]+'</button>').join('')+'</div><div id="theaterLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">🎭 剧场控制系统就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🎨','创意导演','设计你自己的机器人表演场景')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:10px;">💡 创意挑战</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">🏆 <strong>挑战1</strong>：按顺序导演三个场景（醒来→跳舞→谢幕）<br>🎨 <strong>挑战2</strong>：想象一个新的场景——机器人还能表演什么？<br>🎵 <strong>挑战3</strong>：为每个场景配上合适的"背景音乐描述"</div></div><div style="text-align:center;margin:12px 0;"><div style="display:inline-block;padding:12px 20px;background:#e8f0fe;border-radius:14px;font-size:13px;color:#1a5276;">💡 提示：回到上一页操作场景按钮，完成你的导演首秀！</div></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('剧场大导演！','你完成了声控互动剧场的全部表演！','🎭')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 综合运用<strong>声音传感器+蜂鸣器</strong>控制机器人<br>✅ 理解了<strong>舞台+演员+音乐</strong>三要素<br>✅ 导演了<strong>3个完整场景</strong>——醒来→跳舞→谢幕<br>✅ 体验了<strong>传感器→控制器→执行器</strong>的联动<br>✅ 学会了用<strong>创意</strong>设计机器人表演</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R02课程完成！</div><div style="font-size:13px;color:#4a3a2a;">你已经完成了<strong>声音魔法师</strong>的全部4节课！</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}@keyframes cwFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}.cw-info-card{background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;transition:all .2s;}.cw-info-card:hover{border-color:var(--cc,#4a90d9);transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.08);}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html = bHTML();
        const result = wrap('互动剧场导演 — 声控小剧场', html);
        return {html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindTheater();}
            function bindTheater(){
                const sd=container.querySelector('#sceneDisplay'),ad=container.querySelector('#actorDisplay'),md=container.querySelector('#musicDisplay'),tl=container.querySelector('#theaterLog');
                container.querySelectorAll('[data-scene]').forEach(btn=>{btn.onclick=function(){const s=scenes[this.dataset.scene];sd.textContent=s.scene;ad.textContent=s.actor;md.textContent=s.music;const t=new Date().toLocaleTimeString();tl.innerHTML+='<div>⏱ '+t+' → '+s.log+'</div>';tl.scrollTop=tl.scrollHeight;toast('🎬 '+s.scene);};});
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    // ============================================================
    //  R03: 机械小达人 — 5页线上课件
    // ============================================================

    registry['3-1'] = function() {
        let currentPage=0, totalPages=5, pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'], quizScore=0;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('⚖️','神奇的杠杆','给我一个支点，我能撬动地球！——阿基米德')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">⚖️</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🔧 <strong>杠杆</strong>是最简单的机械之一！<br>跷跷板、剪刀、开瓶器——都是杠杆！<br>它由<strong style="color:#1a2a6c;">支点、力臂、重物</strong>三部分组成。</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">你和爸爸玩跷跷板，为什么爸爸那边<strong>总在下面</strong>？<br>💡 提示：跟重量和位置有关...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','杠杆三要素','支点、力臂、重物——杠杆的三大要素')+'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🔺',title:'支点',desc:'杠杆绕其转动的固定点',color:'#e74c3c'},{icon:'💪',title:'力臂',desc:'从支点到施力点的距离',color:'#4a90d9'},{icon:'🏋️',title:'重物',desc:'需要被移动的物体',color:'#e67e22'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:36px;">'+c.icon+'</div><div style="font-size:14px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:11px;color:#7a6a5a;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔑 杠杆原理</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">支点越<strong>靠近重物</strong> → 力臂越<strong>长</strong> → 越<strong>省力</strong>！<br>这就是为什么剪刀手柄比刀刃长的原因 ✂️</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：杠杆模拟','拖动支点位置，观察杠杆的平衡变化')+'<div style="text-align:center;margin-bottom:14px;"><div style="position:relative;width:300px;height:120px;margin:0 auto;background:#f0ede4;border-radius:12px;overflow:hidden;"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:16px;height:40px;background:#555;border-radius:4px 4px 0 0;z-index:2;transition:left .3s;" id="fulcrumPivot"></div><div style="position:absolute;bottom:20px;left:0;width:300px;height:8px;background:#8B4513;border-radius:4px;transform-origin:50% bottom;transition:transform .3s;" id="leverBar"></div><div style="position:absolute;bottom:28px;left:20px;font-size:24px;transition:all .3s;" id="leftWeight">⬇️</div><div style="position:absolute;bottom:28px;right:20px;font-size:24px;transition:all .3s;" id="rightWeight">⬆️</div></div><div style="margin-top:8px;"><span class="sim-label">支点位置：</span><input type="range" class="sim-slider" id="fulcrumSlider" min="10" max="90" value="50" style="width:200px;"><span class="sim-value" id="fulcrumDisplay">50%</span></div></div><div id="leverInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">💡 支点在中间 → 平衡状态</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','杠杆知识闯关','检验你对杠杆原理的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('杠杆小达人！','你掌握了杠杆原理，理解了支点与力臂的关系！','⚖️')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 杠杆的<strong>三大要素</strong>：支点、力臂、重物<br>✅ 支点越<strong>靠近重物</strong>越省力<br>✅ 力臂<strong>越长</strong>，需要的力越<strong>小</strong><br>✅ 生活中到处是杠杆：剪刀、跷跷板、开瓶器</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们要探索<strong>齿轮的奥秘</strong>！大齿轮和小齿轮一起转！⚙️</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}.cw-info-card{background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;transition:all .2s;}.cw-info-card:hover{border-color:var(--cc,#4a90d9);transform:translateY(-3px);box-shadow:0 6px 16px rgba(0,0,0,.08);}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('杠杆工程师 — 杠杆原理探索',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                const lb=container.querySelector('#leverBar'),fs=container.querySelector('#fulcrumSlider'),fd=container.querySelector('#fulcrumDisplay'),li=container.querySelector('#leverInfo'),lw=container.querySelector('#leftWeight'),rw=container.querySelector('#rightWeight'),fp=container.querySelector('#fulcrumPivot');
                fs.oninput=function(){const v=parseInt(this.value);fd.textContent=v+'%';const t=(v-50)*0.3;lb.style.transform='rotate('+t+'deg)';lb.style.transformOrigin=v+'% bottom';if(fp)fp.style.left=v+'%';if(v<40){li.innerHTML='💡 支点靠近左侧 → 右侧力臂长，右侧更省力 ⬆️';lw.textContent='⬇️';rw.textContent='⬆️⬆️';}else if(v>60){li.innerHTML='💡 支点靠近右侧 → 左侧力臂长，左侧更省力 ⬆️';lw.textContent='⬆️⬆️';rw.textContent='⬇️';}else{li.innerHTML='💡 支点在中间 → 平衡状态 ⚖️';lw.textContent='⬇️';rw.textContent='⬆️';}};
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'杠杆的"支点"是什么？',opts:['放重物的地方','杠杆绕其转动的固定点','施力的位置','杠杆的材料'],ans:1,emoji:'🔺',hint:'支点是杠杆转动的轴心'},{q:'支点靠近重物，会怎样？',opts:['更费力','更省力','没变化','杠杆会断'],ans:1,emoji:'💪',hint:'力臂变长就省力'},{q:'以下哪个不是杠杆？',opts:['剪刀','跷跷板','开瓶器','轮子'],ans:3,emoji:'🤔',hint:'轮子不是杠杆类简单机械'},{q:'力臂越长，需要的力越？',opts:['大','小','不变','不确定'],ans:1,emoji:'📏',hint:'力臂越长越省力'},{q:'跷跷板属于什么简单机械？',opts:['滑轮','齿轮','杠杆','斜面'],ans:2,emoji:'⚖️',hint:'跷跷板是典型的杠杆'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'杠杆小专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['3-2'] = function() {
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('⚙️','齿轮转转转','大齿轮带动小齿轮——速度与力量的魔法！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-flex;align-items:center;gap:12px;animation:simFloat 2s ease-in-out infinite;"><span style="font-size:56px;">⚙️</span><span style="font-size:28px;">→</span><span style="font-size:40px;">⚙️</span></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">⚙️ <strong>齿轮</strong>是带齿的轮子，两个齿轮咬在一起就能传递运动！<br>自行车、钟表、汽车里都有齿轮——<br>它们可以<strong style="color:#1a2a6c;">改变速度和力量</strong>！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">自行车爬坡时为什么要<strong>换挡</strong>？<br>💡 提示：上坡需要更大的力量...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','齿轮比与传动','大齿轮+小齿轮=速度变化')+'<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'⚙️',title:'主动轮',desc:'连接马达，提供动力的齿轮',color:'#4a90d9'},{icon:'→',title:'传动',desc:'两个齿轮咬合传递运动',color:'#e67e22'},{icon:'⚙️',title:'从动轮',desc:'被带动的齿轮，速度会变化',color:'#e74c3c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔑 齿轮比规则</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">大齿轮→小齿轮：<strong>加速</strong>但力量变小 🚀<br>小齿轮→大齿轮：<strong>减速</strong>但力量变大 💪<br>齿轮比 = 从动轮齿数 ÷ 主动轮齿数</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：齿轮传动','调整齿轮比，观察转速和力量的变化')+'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-flex;align-items:center;gap:8px;padding:20px;background:#f0ede4;border-radius:16px;"><div style="width:60px;height:60px;border-radius:50%;background:#4a90d9;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;animation:simSpin 2s linear infinite;" id="gearA">⚙</div><div style="font-size:20px;color:#7a6a5a;">→</div><div style="width:40px;height:40px;border-radius:50%;background:#e67e22;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;animation:simSpin 1.33s linear infinite;" id="gearB">⚙</div></div></div><div style="text-align:center;margin-bottom:12px;"><span class="sim-label">齿轮比：</span><input type="range" class="sim-slider" id="gearSlider" min="1" max="5" value="1" step="1" style="width:200px;"><span class="sim-value" id="gearDisplay">1:1</span></div><div id="gearInfo" style="text-align:center;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">💡 齿轮比 1:1 → 速度相同</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','齿轮知识闯关','检验你对齿轮传动的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('齿轮工程师！','你掌握了齿轮传动原理，理解了速度与力量的平衡！','⚙️')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 齿轮通过<strong>咬合</strong>传递运动和力量<br>✅ <strong>齿轮比</strong>决定速度变化：大带小=加速<br>✅ 加速时<strong>力量减小</strong>，减速时<strong>力量增大</strong><br>✅ 生活中应用：自行车变速、钟表、汽车变速箱</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们要学习<strong>滑轮</strong>！看看它如何帮我们省力！🔄</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('齿轮传动师 — 齿轮比实验',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                const gA=container.querySelector('#gearA'),gB=container.querySelector('#gearB'),gS=container.querySelector('#gearSlider'),gD=container.querySelector('#gearDisplay'),gI=container.querySelector('#gearInfo');
                gS.oninput=function(){const r=parseInt(this.value);gD.textContent=r+':1';const s=2*r;gB.style.animationDuration=(2/s)+'s';if(r===1){gI.innerHTML='💡 齿轮比 1:1 → 速度相同，扭矩相同 ⚖️';}else if(r<3){gI.innerHTML='💡 齿轮比 '+r+':1 → 从动轮加速，扭矩减小 ⚡';}else{gI.innerHTML='💡 齿轮比 '+r+':1 → 从动轮高速旋转，扭矩大幅减小 🚀';}};
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'齿轮通过什么方式传递运动？',opts:['摩擦','咬合','磁力','胶水'],ans:1,emoji:'⚙️',hint:'齿轮的齿互相咬合'},{q:'大齿轮带动小齿轮，小齿轮会？',opts:['减速','停转','加速','反转'],ans:2,emoji:'🚀',hint:'大带小=加速'},{q:'齿轮比3:1表示从动轮速度是？',opts:['相同','3倍','1/3','2倍'],ans:1,emoji:'📐',hint:'3:1=3倍速度'},{q:'加速时，力量会？',opts:['变大','不变','变小','反转'],ans:2,emoji:'💪',hint:'速度越快力量越小'},{q:'自行车上坡时应该用哪个档？',opts:['高档(快)','低档(慢但有力)','不变','倒档'],ans:1,emoji:'🚲',hint:'上坡需要更大力量'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'齿轮小专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['3-3'] = function() {
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0;
        const types={fixed:{icon:'🔄',name:'定滑轮',force:100,desc:'改变力的方向，不省力。就像升旗杆顶端的滑轮。'},movable:{icon:'🔃',name:'动滑轮',force:50,desc:'省一半力，但不改变方向。就像吊车上的滑轮。'},compound:{icon:'⚙️',name:'滑轮组',force:25,desc:'既省力又改变方向，n段绳子省力n倍！'}};
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🔄','滑轮升降机','一根绳子和一个轮子——就能轻松提起重物！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🔄⬆️</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🏗️ 建筑工地的<strong>塔吊</strong>、学校旗杆顶端的<strong>小轮子</strong>——<br>这些都是<strong style="color:#1a2a6c;">滑轮</strong>！<br>滑轮可以帮我们<strong>改变力的方向</strong>，甚至<strong>省力</strong>！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">升旗时，我们<strong>向下拉</strong>绳子，旗子却<strong>向上走</strong>——<br>这是为什么？💡 提示：旗杆顶上有个滑轮...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','三种滑轮','定滑轮、动滑轮、滑轮组——各有各的本领')+'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🔄',title:'定滑轮',desc:'固定不动\n改变方向，不省力',color:'#4a90d9'},{icon:'🔃',title:'动滑轮',desc:'随重物移动\n省一半力',color:'#5cb85c'},{icon:'⚙️',title:'滑轮组',desc:'多个组合\n既省力又变方向',color:'#e67e22'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔑 省力规律</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">定滑轮：拉力 = <strong>100%</strong> 重物重量<br>动滑轮：拉力 = <strong>50%</strong> 重物重量<br>滑轮组：拉力 = <strong>25%</strong> 重物重量</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：滑轮模拟','切换滑轮类型，观察所需拉力的变化')+'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:20px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;" id="pulleyIcon">🔄</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;" id="pulleyTypeDisplay">定滑轮</div><div style="margin-top:8px;"><span class="sim-label">所需拉力：</span><span class="sim-value" id="forceDisplay">100%</span></div><div class="sim-progress" style="width:160px;margin:8px auto;"><div class="sim-progress-bar" id="forceBar" style="width:100%;background:linear-gradient(90deg,#5cb85c,#f1c40f,#e74c3c);"></div></div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-primary" data-type="fixed">🔄 定滑轮</button><button class="sim-btn sim-btn-primary" data-type="movable">🔃 动滑轮</button><button class="sim-btn sim-btn-primary" data-type="compound">⚙️ 滑轮组</button></div><div id="pulleyInfo" style="text-align:center;margin-top:12px;padding:12px;background:#e8f0fe;border-radius:10px;font-size:14px;color:#1a5276;">💡 定滑轮：改变力的方向，不省力</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','滑轮知识闯关','检验你对滑轮原理的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('滑轮专家！','你掌握了三种滑轮的特点和省力原理！','🔄')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ <strong>定滑轮</strong>：改变力的方向，不省力<br>✅ <strong>动滑轮</strong>：省一半力，方向不变<br>✅ <strong>滑轮组</strong>：既省力又改变方向<br>✅ 滑轮越多越<strong>省力</strong></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">综合杠杆+齿轮+滑轮——<strong>制作机械手臂</strong>！🦾</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('滑轮设计师 — 滑轮系统模拟',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                const pi=container.querySelector('#pulleyIcon'),pt=container.querySelector('#pulleyTypeDisplay'),fd=container.querySelector('#forceDisplay'),fb=container.querySelector('#forceBar'),pI=container.querySelector('#pulleyInfo');
                container.querySelectorAll('[data-type]').forEach(btn=>{btn.onclick=function(){const t=types[this.dataset.type];pi.textContent=t.icon;pt.textContent=t.name;fd.textContent=t.force+'%';fb.style.width=t.force+'%';pI.innerHTML='💡 '+t.name+'：'+t.desc;toast('✅ 切换到'+t.name);};});
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'定滑轮的主要作用是什么？',opts:['省力','改变力的方向','加速','减速'],ans:1,emoji:'🔄',hint:'定滑轮改变方向不省力'},{q:'动滑轮能省多少力？',opts:['不省力','省一半','省3/4','省全部'],ans:1,emoji:'🔃',hint:'动滑轮省一半力'},{q:'旗杆顶端用的是哪种滑轮？',opts:['动滑轮','滑轮组','定滑轮','没有滑轮'],ans:2,emoji:'🚩',hint:'旗杆顶是固定的定滑轮'},{q:'滑轮组的特点是什么？',opts:['只省力','只变方向','既省力又变方向','都不行'],ans:2,emoji:'⚙️',hint:'组合滑轮=省力+变方向'},{q:'绳子段数越多，拉力越？',opts:['大','小','不变','不确定'],ans:1,emoji:'📏',hint:'绳子越多越省力'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'滑轮小专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['3-4'] = function() {
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🦾','机械手臂挑战','综合杠杆+齿轮+滑轮——打造你的机械手臂！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">🦾</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🏭 工厂里的<strong>机械手臂</strong>可以焊接、组装、搬运——<br>它们由<strong style="color:#1a2a6c;">多个关节</strong>组成，<br>每个关节都能转动，就像人的胳膊一样灵活！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">人的手臂有几个<strong>关节</strong>？<br>💡 提示：肩膀、手肘、手腕...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','机械臂的关节','多个关节协作，才能到达任意位置')+'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🔵',title:'关节1(肩)',desc:'最靠近底座\n决定大臂方向',color:'#4a90d9'},{icon:'🟠',title:'关节2(肘)',desc:'连接大臂和小臂\n控制弯折角度',color:'#e67e22'},{icon:'🟢',title:'关节3(腕)',desc:'最靠近末端\n控制抓取方向',color:'#5cb85c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔑 自由度</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">每个关节增加<strong>1个自由度</strong><br>3个关节 = <strong>3自由度</strong>机械臂<br>可以到达空间中的<strong>任意位置</strong>！</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：虚拟机械臂','调整3个关节角度，控制机械臂抓取目标')+'<div style="text-align:center;margin-bottom:14px;"><div style="position:relative;width:240px;height:200px;margin:0 auto;background:#f0ede4;border-radius:16px;overflow:hidden;"><canvas id="armCanvas" width="240" height="200" style="width:240px;height:200px;"></canvas></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div><span class="sim-label">关节1</span> <input type="range" class="sim-slider" id="joint1" min="0" max="180" value="45" style="width:100px;"> <span class="sim-value" id="j1v">45°</span></div><div><span class="sim-label">关节2</span> <input type="range" class="sim-slider" id="joint2" min="0" max="180" value="90" style="width:100px;"> <span class="sim-value" id="j2v">90°</span></div><div><span class="sim-label">关节3</span> <input type="range" class="sim-slider" id="joint3" min="0" max="180" value="135" style="width:100px;"> <span class="sim-value" id="j3v">135°</span></div></div><div id="armInfo" style="text-align:center;padding:10px;background:#e8f0fe;border-radius:10px;font-size:13px;color:#1a5276;">💡 调整关节角度，控制机械手臂末端位置</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','机械臂知识闯关','检验你对机械手臂的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('机械工程师！','你掌握了杠杆、齿轮、滑轮和机械臂的原理！','🦾')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 机械臂由<strong>多个关节</strong>串联组成<br>✅ 3个关节 = <strong>3自由度</strong> → 可达任意位置<br>✅ 关节角度改变 → 末端<strong>位置改变</strong><br>✅ 综合运用了<strong>杠杆和齿轮</strong>的原理</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R03课程完成！</div><div style="font-size:13px;color:#4a3a2a;">你已经完成了<strong>机械小达人</strong>的全部4节课！</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('机械手臂设计师 — 虚拟机械臂',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                const canvas=container.querySelector('#armCanvas');if(!canvas)return;
                const ctx=canvas.getContext('2d'),j1=container.querySelector('#joint1'),j2=container.querySelector('#joint2'),j3=container.querySelector('#joint3'),j1v=container.querySelector('#j1v'),j2v=container.querySelector('#j2v'),j3v=container.querySelector('#j3v'),armInfo=container.querySelector('#armInfo');
                function drawArm(){
                    ctx.clearRect(0,0,240,200);
                    const a1=parseInt(j1.value)*Math.PI/180,a2=parseInt(j2.value)*Math.PI/180,a3=parseInt(j3.value)*Math.PI/180;
                    const bx=120,by=180,s1=50,s2=45,s3=40;
                    const x1=bx+s1*Math.sin(a1),y1=by-s1*Math.cos(a1);
                    const x2=x1+s2*Math.sin(a1+a2-Math.PI/2),y2=y1-s2*Math.cos(a1+a2-Math.PI/2);
                    const x3=x2+s3*Math.sin(a1+a2+a3-Math.PI),y3=y2-s3*Math.cos(a1+a2+a3-Math.PI);
                    ctx.fillStyle='#555';ctx.fillRect(bx-15,by-5,30,20);
                    ctx.strokeStyle='#4a90d9';ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(x1,y1);ctx.stroke();ctx.fillStyle='#1a2a6c';ctx.beginPath();ctx.arc(bx,by,6,0,2*Math.PI);ctx.fill();
                    ctx.strokeStyle='#e67e22';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.fillStyle='#d4701a';ctx.beginPath();ctx.arc(x1,y1,5,0,2*Math.PI);ctx.fill();
                    ctx.strokeStyle='#5cb85c';ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x3,y3);ctx.stroke();ctx.fillStyle='#4a9a4a';ctx.beginPath();ctx.arc(x2,y2,4,0,2*Math.PI);ctx.fill();
                    ctx.fillStyle='#e74c3c';ctx.beginPath();ctx.arc(x3,y3,6,0,2*Math.PI);ctx.fill();ctx.fillStyle='#fff';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText('🤖 抓取',x3,y3-12);
                    j1v.textContent=j1.value+'°';j2v.textContent=j2.value+'°';j3v.textContent=j3.value+'°';
                    const dist=Math.sqrt((x3-120)**2+(y3-180)**2);armInfo.innerHTML='💡 末端位置 ('+Math.round(x3)+', '+Math.round(y3)+') | 伸展距离 '+Math.round(dist)+'px';
                }
                j1.oninput=drawArm;j2.oninput=drawArm;j3.oninput=drawArm;drawArm();
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'机械臂有几个关节？',opts:['1个','2个','3个','4个'],ans:2,emoji:'🦾',hint:'本课机械臂有3个关节'},{q:'关节1最靠近哪里？',opts:['末端','底座','中间','抓取器'],ans:1,emoji:'🔵',hint:'关节1连接底座'},{q:'3个关节的机械臂有几个自由度？',opts:['1个','2个','3个','6个'],ans:2,emoji:'🔢',hint:'每个关节=1个自由度'},{q:'调整关节角度会改变什么？',opts:['底座位置','末端位置','电机转速','齿轮比'],ans:1,emoji:'🎯',hint:'角度变了，手的位置就变了'},{q:'机械臂综合运用了哪些原理？',opts:['只有杠杆','只有齿轮','杠杆和齿轮','杠杆和滑轮'],ans:2,emoji:'⚙️',hint:'机械臂关节里用了杠杆和齿轮'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'机械臂专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    // ============================================================
    //  R04: AI小侦探 — 5页线上课件
    // ============================================================

    registry['4-1'] = function() {
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0,active=false;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('👁️','机器人的眼睛','摄像头+AI=机器人能"看见"世界！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">👁️📷</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">📷 <strong>摄像头</strong>就是机器人的<strong>"眼睛"</strong>！<br>它拍摄画面 → AI识别内容 → 机器人做出反应<br>这就是<strong style="color:#1a2a6c;">AI视觉</strong>的魔法！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">手机上的<strong>人脸解锁</strong>是怎么认出你的？<br>💡 提示：摄像头+AI识别...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','AI视觉流程','摄像头采集→AI分析→机器人行动')+'<div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0;padding:12px;background:linear-gradient(90deg,#e8f0fe,#f8f6f0,#d5f5e3);border-radius:20px;"><div class="cw-info-card" style="--cc:#4a90d9;flex:1;min-width:80px;"><div style="font-size:32px;">📷</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">采集</div><div style="font-size:10px;color:#7a6a5a;">摄像头拍摄<br>获取图像</div></div><div style="font-size:24px;color:#1a2a6c;font-weight:900;">→</div><div class="cw-info-card" style="--cc:#9b59b6;flex:1;min-width:80px;"><div style="font-size:32px;">🧠</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">AI分析</div><div style="font-size:10px;color:#7a6a5a;">识别物体<br>分类判断</div></div><div style="font-size:24px;color:#1a2a6c;font-weight:900;">→</div><div class="cw-info-card" style="--cc:#5cb85c;flex:1;min-width:80px;"><div style="font-size:32px;">🤖</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">行动</div><div style="font-size:10px;color:#7a6a5a;">机器人执行<br>对应动作</div></div></div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:6px;">🔑 关键概念</div><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">摄像头把<strong>光变成像素</strong> → AI从像素中<strong>找到规律</strong> → 告诉机器人该做什么</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：操作摄像头','模拟打开摄像头、拍照、查看画面')+'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;width:240px;height:160px;background:#1e1e2e;border-radius:12px;position:relative;overflow:hidden;" id="cameraView"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#6c7086;font-size:14px;" id="camStatus">📷 摄像头待机中</div><div style="position:absolute;top:8px;left:8px;width:8px;height:8px;border-radius:50%;background:#e74c3c;" id="recDot"></div><div style="position:absolute;bottom:8px;left:8px;color:#cdd6f4;font-size:10px;font-family:monospace;" id="camInfo">分辨率: 640x480</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="camOnBtn">📷 开启摄像头</button><button class="sim-btn sim-btn-warning" id="captureBtn">📸 拍照</button><button class="sim-btn sim-btn-danger" id="camOffBtn">⏹ 关闭</button></div><div id="camLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">📹 视觉系统就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','AI视觉闯关','检验你对AI视觉的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('视觉小侦探！','你理解了AI视觉的基本原理——摄像头+AI=机器人的眼睛！','👁️')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ <strong>摄像头</strong>是机器人的"眼睛"<br>✅ AI视觉流程：<strong>采集→分析→行动</strong><br>✅ 摄像头把光变成<strong>像素图像</strong><br>✅ AI从图像中<strong>识别物体</strong></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们来体验<strong>人脸识别</strong>——机器人能认出你是谁！👤</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('视觉认知师 — 摄像头操作',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                active=false;const cv=container.querySelector('#cameraView'),cs=container.querySelector('#camStatus'),rd=container.querySelector('#recDot'),cl=container.querySelector('#camLog');
                function log(msg){const t=new Date().toLocaleTimeString();cl.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>';cl.scrollTop=cl.scrollHeight;}
                container.querySelector('#camOnBtn').onclick=function(){active=true;cs.textContent='🟢 实时画面';cs.style.color='#a6e3a1';rd.style.animation='simPulse 1s infinite';cv.style.background='linear-gradient(135deg,#2d4a8e,#4a90d9)';log('📷 摄像头已开启');toast('📷 摄像头已开启');};
                container.querySelector('#captureBtn').onclick=function(){if(!active){toast('⚠️ 请先开启摄像头');return;}cv.style.background='#fff';setTimeout(()=>{cv.style.background='linear-gradient(135deg,#2d4a8e,#4a90d9)';},200);log('📸 已拍照！图像已保存');toast('📸 拍照成功！');};
                container.querySelector('#camOffBtn').onclick=function(){active=false;cs.textContent='📷 摄像头待机中';cs.style.color='#6c7086';rd.style.animation='none';cv.style.background='#1e1e2e';log('⏹ 摄像头已关闭');};
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'机器人的"眼睛"是什么？',opts:['马达','摄像头','蜂鸣器','轮子'],ans:1,emoji:'📷',hint:'摄像头拍摄画面'},{q:'AI视觉的第一步是什么？',opts:['行动','分析','采集图像','识别'],ans:2,emoji:'📷',hint:'先用摄像头采集'},{q:'摄像头把光变成什么？',opts:['声音','电信号','像素','文字'],ans:2,emoji:'🖼️',hint:'图像由像素组成'},{q:'AI视觉的正确流程是？',opts:['行动→分析→采集','采集→行动→分析','分析→采集→行动','采集→分析→行动'],ans:3,emoji:'🔄',hint:'先看→再想→最后做'},{q:'以下哪个不用AI视觉？',opts:['人脸解锁','拍照识物','语音助手','自动驾驶'],ans:2,emoji:'🤔',hint:'语音助手用的是语音识别'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'AI视觉小专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['4-2'] = function() {
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0,enrolled=[];
        const names=['小明','小红','小刚','小美','小华'];
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('👤','人脸识别体验','AI能记住人脸——就像机器人有了"记性"！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:72px;">👤🔍</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">📱 手机<strong>人脸解锁</strong>、🚪 门禁<strong>刷脸开门</strong>——<br>这些都是<strong style="color:#1a2a6c;">人脸识别</strong>技术！<br>AI先"学习"人脸 → 再"认出"你是谁！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">AI是怎么区分<strong>不同人的脸</strong>的？<br>💡 提示：眼睛距离、鼻子形状...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','人脸识别两步走','录入(学习) → 识别(认出)')+'<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📝',title:'录入',desc:'拍摄人脸照片\n提取特征存入数据库',color:'#4a90d9'},{icon:'🔍',title:'识别',desc:'拍新照片比对数据库\n找到匹配的人',color:'#5cb85c'},{icon:'📊',title:'置信度',desc:'匹配的可靠程度\n越高越准确',color:'#e67e22'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:90px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">AI提取人脸<strong>特征点</strong>（眼睛、鼻子、嘴巴位置）<br>就像每个人都有<strong>独特的面孔密码</strong>！</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：人脸识别','录入人脸数据，体验AI识别过程')+'<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:14px;"><div style="text-align:center;padding:14px;background:#f0ede4;border-radius:16px;width:130px;"><div style="font-size:44px;" id="faceIcon">👤</div><div style="font-size:12px;font-weight:600;color:#4a3a2a;" id="faceName">未识别</div><div style="font-size:11px;color:#7a6a5a;" id="faceConfidence">置信度: —</div></div><div style="text-align:center;padding:14px;background:#f0ede4;border-radius:16px;width:130px;"><div style="font-size:12px;font-weight:600;color:#4a3a2a;margin-bottom:6px;">已录入人脸</div><div id="faceList" style="font-size:11px;color:#7a6a5a;">暂无数据</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="enrollBtn">📝 录入人脸</button><button class="sim-btn sim-btn-primary" id="recognizeBtn">🔍 识别</button><button class="sim-btn sim-btn-outline" id="clearFacesBtn">🗑️ 清空</button></div><div id="faceLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">👤 人脸识别系统就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','人脸识别闯关','检验你对AI人脸识别的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('人脸识别师！','你理解了AI如何"记住"和"认出"人脸！','👤')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 人脸识别分两步：<strong>录入→识别</strong><br>✅ 录入时AI提取<strong>人脸特征</strong><br>✅ 识别时比对<strong>特征数据库</strong><br>✅ <strong>置信度</strong>表示识别可靠程度</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">我们来当<strong>物品分类大师</strong>——AI能认出水果和蔬菜！🍎🥦</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('人脸识别师 — 人脸录入与识别',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                enrolled=[];const fi=container.querySelector('#faceIcon'),fn=container.querySelector('#faceName'),fc=container.querySelector('#faceConfidence'),fl=container.querySelector('#faceList'),fLog=container.querySelector('#faceLog');
                function log(msg){const t=new Date().toLocaleTimeString();fLog.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>';fLog.scrollTop=fLog.scrollHeight;}
                container.querySelector('#enrollBtn').onclick=function(){if(enrolled.length>=5){toast('⚠️ 最多录入5人');return;}const n=names[enrolled.length];enrolled.push(n);fl.innerHTML=enrolled.map(nn=>'<div style="margin:2px 0;">✅ '+nn+'</div>').join('');log('📝 已录入: '+n);toast('✅ 已录入 '+n);};
                container.querySelector('#recognizeBtn').onclick=function(){if(enrolled.length===0){toast('⚠️ 请先录入人脸');return;}const idx=Math.floor(Math.random()*enrolled.length);const conf=(85+Math.random()*14).toFixed(1);fi.textContent='🧑';fn.textContent=enrolled[idx];fc.textContent='置信度: '+conf+'%';log('🔍 识别成功: '+enrolled[idx]+' ('+conf+'%)');toast('🔍 识别: '+enrolled[idx]);};
                container.querySelector('#clearFacesBtn').onclick=function(){enrolled=[];fl.innerHTML='暂无数据';fi.textContent='👤';fn.textContent='未识别';fc.textContent='置信度: —';log('🗑️ 已清空所有人脸数据');toast('🗑️ 已清空');};
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'人脸识别第一步是什么？',opts:['识别','录入人脸','拍照','分析'],ans:1,emoji:'📝',hint:'先录入才能识别'},{q:'AI识别靠什么区分不同人？',opts:['衣服颜色','人脸特征','身高','发型'],ans:1,emoji:'🔍',hint:'眼睛鼻子嘴巴的位置'},{q:'"置信度"是什么意思？',opts:['照片大小','识别速度','可靠程度','人脸数量'],ans:2,emoji:'📊',hint:'越高越确定'},{q:'识别时需要比对什么？',opts:['新照片','特征数据库','密码','指纹'],ans:1,emoji:'🗄️',hint:'跟已录入的特征比对'},{q:'以下哪个场景用人脸识别？',opts:['测温度','人脸解锁','称重量','量身高'],ans:1,emoji:'📱',hint:'手机解锁=人脸识别'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'人脸识别专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['4-3'] = function() {
        const items=['🍎 苹果','🍌 香蕉','🥕 胡萝卜','🥦 西兰花','🍇 葡萄'];
        const correctCat={'🍎 苹果':'水果','🍌 香蕉':'水果','🥕 胡萝卜':'蔬菜','🥦 西兰花':'蔬菜','🍇 葡萄':'水果'};
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0,score=0,total=0,currentItem='';
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🏷️','物品分类大师','AI不仅能"看到"东西——还能"认出"它是什么！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-flex;gap:12px;animation:simFloat 2s ease-in-out infinite;"><span style="font-size:48px;">🍎</span><span style="font-size:48px;">🥦</span><span style="font-size:48px;">🍇</span></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🏷️ <strong>分类</strong>是AI的重要能力！<br>给AI看一张图片，它就能告诉你——<br>这是<strong style="color:#e74c3c;">🍎水果</strong>还是<strong style="color:#5cb85c;">🥦蔬菜</strong>！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">你是怎么区分<strong>苹果</strong>和<strong>西兰花</strong>的？<br>💡 提示：颜色、形状...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','AI如何分类','特征提取→模型判断→给出结果')+'<div style="display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;margin:16px 0;padding:12px;background:linear-gradient(90deg,#fdebd0,#e8f0fe,#d5f5e3);border-radius:20px;"><div style="text-align:center;padding:10px;min-width:80px;"><div style="font-size:28px;">🔍</div><div style="font-size:11px;font-weight:700;color:#4a3a2a;">提取特征</div><div style="font-size:10px;color:#7a6a5a;">颜色、形状、纹理</div></div><div style="font-size:20px;color:#1a2a6c;">→</div><div style="text-align:center;padding:10px;min-width:80px;"><div style="font-size:28px;">🧠</div><div style="font-size:11px;font-weight:700;color:#4a3a2a;">模型判断</div><div style="font-size:10px;color:#7a6a5a;">对比训练过的数据</div></div><div style="font-size:20px;color:#1a2a6c;">→</div><div style="text-align:center;padding:10px;min-width:80px;"><div style="font-size:28px;">✅</div><div style="font-size:11px;font-weight:700;color:#4a3a2a;">输出结果</div><div style="font-size:10px;color:#7a6a5a;">水果 / 蔬菜</div></div></div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">🍎 红色/圆形/光滑 → <strong>水果</strong><br>🥦 绿色/颗粒状/粗糙 → <strong>蔬菜</strong><br>AI学习这些<strong>特征规律</strong>来分类！</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：物品分类','给物品选择正确的类别——水果还是蔬菜？')+'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:18px 36px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;" id="itemIcon">🎯</div><div style="font-size:15px;font-weight:700;color:#4a3a2a;" id="itemName">点击分类按钮开始</div></div></div><div style="text-align:center;margin-bottom:10px;"><span class="sim-label">⭐ 得分：</span><span class="sim-value" id="classScore">0</span><span style="margin:0 10px;color:#d0c4b4;">|</span><span class="sim-label">📝 进度：</span><span class="sim-value" id="classProgress">0/10</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" data-cat="水果">🍎 水果</button><button class="sim-btn sim-btn-primary" data-cat="蔬菜">🥦 蔬菜</button><button class="sim-btn sim-btn-outline" id="resetClassBtn">🔄 重置</button></div><div id="classLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">🏷️ 分类系统就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','分类知识闯关','检验你对AI分类的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('分类小达人！','你理解了AI如何根据特征给物品分类！','🏷️')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ AI通过<strong>特征</strong>来识别物品类别<br>✅ 分类三大步：<strong>提取→判断→输出</strong><br>✅ 颜色、形状、纹理都是<strong>分类依据</strong><br>✅ AI模型需要<strong>大量数据训练</strong>才能准确</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课预告</div><div style="font-size:13px;color:#4a3a2a;">机器人会<strong>跟着目标走</strong>——就像小宠物跟着主人！🎯🤖</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('物品分类师 — AI物品分类',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                score=0;total=0;currentItem='';const iI=container.querySelector('#itemIcon'),iN=container.querySelector('#itemName'),cS=container.querySelector('#classScore'),cP=container.querySelector('#classProgress');
                function nextItem(){if(total>=10){iN.textContent='完成！得分 '+score+'/10';iI.textContent=score>=8?'🏆':'💪';toast('🎉 完成！'+score+'/10');return;}currentItem=items[Math.floor(Math.random()*items.length)];iI.textContent=currentItem.split(' ')[0];iN.textContent=currentItem;total++;cP.textContent=total+'/10';}
                container.querySelectorAll('[data-cat]').forEach(btn=>{btn.onclick=function(){if(!currentItem){nextItem();return;}const cat=this.dataset.cat;if(cat===correctCat[currentItem]){score++;cS.textContent=score;toast('✅ 正确！');}else{toast('❌ 应该是'+correctCat[currentItem]);}currentItem='';setTimeout(nextItem,800);};});
                container.querySelector('#resetClassBtn').onclick=function(){score=0;total=0;currentItem='';cS.textContent='0';cP.textContent='0/10';iI.textContent='🎯';iN.textContent='点击分类按钮开始';toast('🔄 已重置');};
                nextItem();
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'AI分类的第一步是？',opts:['输出结果','提取特征','拍照','判断'],ans:1,emoji:'🔍',hint:'先提取颜色形状等特征'},{q:'以下哪个是分类特征？',opts:['重量','颜色','价格','产地'],ans:1,emoji:'🎨',hint:'颜色是重要视觉特征'},{q:'AI分类模型需要什么？',opts:['电池','大量训练数据','轮子','音乐'],ans:1,emoji:'📊',hint:'数据越多分类越准'},{q:'🍎苹果属于哪一类？',opts:['蔬菜','肉类','水果','谷物'],ans:2,emoji:'🍎',hint:'苹果是水果'},{q:'分类结果不准确怎么办？',opts:['放弃','增加训练数据','换电池','重启'],ans:1,emoji:'📈',hint:'更多数据=更好模型'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'分类小专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    registry['4-4'] = function() {
        let targetX=150,targetY=100,robotX=50,robotY=150;
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0,following=false,followTimer=null;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle('🎯','AI目标跟随','机器人锁定一个目标——然后一直跟着它走！')+'<div style="text-align:center;margin:16px 0;"><div style="display:inline-block;animation:simFloat 2s ease-in-out infinite;font-size:64px;">🎯→🤖</div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">🎯 <strong>目标跟随</strong>是AI视觉的进阶应用！<br>摄像头不断拍摄 → AI计算目标位置 → <br>机器人<strong style="color:#1a2a6c;">自动追踪</strong>目标移动！<br>就像宠物小狗<strong>跟着主人跑</strong>！🐕</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;line-height:1.6;">机器人需要<strong>一直算</strong>自己和目标的距离——<br>这需要什么传感器？💡 提示：摄像头...</div></div></div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','跟随原理','定位目标→计算距离→移动追踪')+'<div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0;padding:12px;background:linear-gradient(90deg,#fdebd0,#e8f0fe,#d5f5e3);border-radius:20px;">'+[{icon:'📷',title:'视觉定位',desc:'摄像头检测目标\n计算坐标位置',color:'#4a90d9'},{icon:'📐',title:'距离计算',desc:'比较目标坐标\n和机器人坐标',color:'#e67e22'},{icon:'🏃',title:'移动追踪',desc:'机器人向目标\n方向移动靠近',color:'#5cb85c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:80px;"><div style="font-size:28px;">'+c.icon+'</div><div style="font-size:12px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:9px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;margin:12px 0;"><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">机器人<strong>不断重复</strong>：看 → 算 → 移 → 看 → 算 → 移<br>直到<strong>到达目标附近</strong>为止！</div></div></div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验：目标跟随','移动目标，让机器人自动追踪！')+'<div style="text-align:center;margin-bottom:14px;"><div style="position:relative;width:280px;height:180px;margin:0 auto;background:#f0ede4;border-radius:12px;overflow:hidden;" id="followArea"><div style="position:absolute;font-size:22px;transition:all .5s;left:150px;top:80px;" id="targetObj">🎯</div><div style="position:absolute;font-size:22px;transition:all .8s;left:50px;top:140px;" id="followRobot">🤖</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="moveTargetBtn">🎯 移动目标</button><button class="sim-btn sim-btn-primary" id="startFollowBtn">🚀 开始跟随</button><button class="sim-btn sim-btn-outline" id="resetFollowBtn">🔄 重置</button></div><div id="followLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:60px;overflow-y:auto;">🎯 跟随系统就绪...</div></div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','跟随知识闯关','检验你对AI目标跟随的理解！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('AI小侦探毕业！','你掌握了AI视觉的完整流程：看→识别→跟随！','🎯')+'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 今天我学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 目标跟随 = <strong>定位→计算→移动</strong>循环<br>✅ AI通过摄像头<strong>持续追踪</strong>目标位置<br>✅ 机器人不断计算<strong>距离差</strong>来调整方向<br>✅ 综合运用了<strong>视觉+计算+运动控制</strong></div></div><div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;"><div style="font-size:28px;margin-bottom:4px;">🌟</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R04课程完成！</div><div style="font-size:13px;color:#4a3a2a;">你已经完成了<strong>AI小侦探</strong>的全部4节课！</div></div></div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap('目标跟随师 — 视觉跟随',html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;if(following){following=false;if(followTimer)clearTimeout(followTimer);}currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2)bindLab();if(n===3)bindQuiz();}
            function bindLab(){
                targetX=150;targetY=80;robotX=50;robotY=140;following=false;if(followTimer)clearTimeout(followTimer);
                const tg=container.querySelector('#targetObj'),rb=container.querySelector('#followRobot'),fLog=container.querySelector('#followLog');
                function log(msg){const t=new Date().toLocaleTimeString();fLog.innerHTML+='<div>⏱ '+t+' → '+msg+'</div>';fLog.scrollTop=fLog.scrollHeight;}
                function moveTarget(){targetX=20+Math.random()*240;targetY=20+Math.random()*140;tg.style.left=targetX+'px';tg.style.top=targetY+'px';log('🎯 目标移动到 ('+Math.round(targetX)+', '+Math.round(targetY)+')');}
                function followTarget(){if(!following)return;const dx=targetX-robotX,dy=targetY-robotY;const dist=Math.sqrt(dx*dx+dy*dy);if(dist>25){robotX+=dx*0.12;robotY+=dy*0.12;rb.style.left=robotX+'px';rb.style.top=robotY+'px';}else{log('✅ 已到达目标附近！');toast('✅ 跟随成功！');}followTimer=setTimeout(followTarget,100);}
                container.querySelector('#moveTargetBtn').onclick=moveTarget;
                container.querySelector('#startFollowBtn').onclick=function(){following=true;log('🚀 开始跟随目标');followTarget();};
                container.querySelector('#resetFollowBtn').onclick=function(){following=false;if(followTimer)clearTimeout(followTimer);robotX=50;robotY=140;rb.style.left='50px';rb.style.top='140px';targetX=150;targetY=80;tg.style.left='150px';tg.style.top='80px';log('🔄 已重置');};
                if(tg){tg.style.left='150px';tg.style.top='80px';}if(rb){rb.style.left='50px';rb.style.top='140px';}
            }
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn');
                const bank=[{q:'目标跟随的第一步是？',opts:['移动','拍照','定位目标','停止'],ans:2,emoji:'📷',hint:'先看到目标在哪'},{q:'机器人靠什么追踪目标？',opts:['声音','摄像头','触摸','气味'],ans:1,emoji:'👁️',hint:'用视觉持续追踪'},{q:'机器人追上目标后做什么？',opts:['继续跑','停下','后退','转圈'],ans:1,emoji:'⏹',hint:'到达目标附近就停'},{q:'跟随过程中机器人不断计算什么？',opts:['时间','距离差','温度','音量'],ans:1,emoji:'📐',hint:'算自己和目标的距离'},{q:'目标跟随用到了哪些技术？',opts:['只有视觉','视觉+计算+控制','只有马达','只有传感器'],ans:1,emoji:'🔗',hint:'综合运用多项技术'}];
                function nq(){if(qr>=5){if(qe)qe.textContent=quizScore>=4?'🏆':quizScore>=3?'😊':'💪';if(qq)qq.textContent=quizScore>=4?'跟随专家！':quizScore>=3?'不错！':'再复习下吧~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,5)+'<br><span style="font-size:14px;">'+quizScore+'/5 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=4)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji;if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+q.hint+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」。'+q.hint+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    };

    // ============================================================
    //  R05-R12: 多页课件生成器（成长期 & 硬核期）
    // ============================================================

    function createMultiPageSim(config) {
        // config: {courseCode, courseTitle, lessonTopic, introHTML, knowledgeHTML, labHTML, labInit, quizBank, summaryHTML, nextHTML}
        let currentPage=0,totalPages=5,pageTitles=['📖 场景引入','🧠 知识探索','🔬 动手实验','🏆 闯关挑战','🎉 课堂小结'],quizScore=0;
        function rpn(){let d='';for(let i=0;i<totalPages;i++){const c=i===currentPage?'active':(i<currentPage?'done':'');d+='<span class="cw-dot '+c+'" data-goto="'+i+'">'+(i<currentPage?'✓':(i+1))+'</span>';}return'<div class="cw-progress"><div class="cw-progress-fill" style="width:'+((currentPage+1)/totalPages*100)+'%"></div></div><div class="cw-dots-row">'+d+'</div><div class="cw-page-label">'+pageTitles[currentPage]+'</div>';}
        function rpc(n){switch(n){
            case 0:return'<div class="cw-page-inner">'+sectionTitle(config.introIcon||'📖','欢迎进入新课程',config.introHTML)+'</div>';
            case 1:return'<div class="cw-page-inner">'+sectionTitle('🧠','知识探索',config.knowledgeHTML)+'</div>';
            case 2:return'<div class="cw-page-inner">'+sectionTitle('🔬','动手实验',config.labHTML)+'</div>';
            case 3:return'<div class="cw-page-inner">'+sectionTitle('🏆','知识闯关','检验你的学习成果！')+'<div style="background:#fff;border-radius:20px;padding:20px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:48px;margin-bottom:8px;" id="qzEmoji">🎯</div><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:12px;" id="qzQuestion">准备开始挑战！</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="qzOptions"></div><div style="margin-top:12px;font-size:13px;color:#7a6a5a;" id="qzFeedback"></div></div><div style="display:flex;gap:12px;justify-content:center;margin-top:10px;"><span style="font-size:13px;font-weight:600;">⭐ 得分：<span style="font-size:18px;color:#1a2a6c;" id="qzScore">0</span>/5</span></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="qzStartBtn">🎮 开始闯关</button><button class="sim-btn sim-btn-outline" id="qzResetBtn">🔄 重来</button></div></div>';
            case 4:return'<div class="cw-page-inner">'+celebrationHTML('课程完成！',config.summaryHTML,'🎓')+(config.nextHTML||'')+'</div>';
            default:return'';
        }}
        function bHTML(){return'<style>.cw-progress{height:5px;background:#e8e0d5;border-radius:10px;overflow:hidden;margin-bottom:12px;}.cw-progress-fill{height:100%;background:linear-gradient(90deg,#4a90d9,#1a2a6c);border-radius:10px;transition:width .4s ease;}.cw-dots-row{display:flex;gap:8px;justify-content:center;margin-bottom:6px;}.cw-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:2px solid #e8e0d5;background:#fff;color:#7a6a5a;}.cw-dot.active{background:#1a2a6c;color:#fff;border-color:#1a2a6c;transform:scale(1.15);box-shadow:0 2px 8px rgba(26,42,108,.3);}.cw-dot.done{background:#5cb85c;color:#fff;border-color:#5cb85c;}.cw-dot:hover:not(.active){border-color:#4a90d9;}.cw-page-label{text-align:center;font-size:12px;font-weight:600;color:#4a90d9;margin-bottom:12px;}.cw-page-inner{animation:cwFadeIn .35s ease-out;}.cw-nav-bottom{display:flex;align-items:center;justify-content:center;gap:12px;padding:12px 0 0;border-top:1px solid #e8e0d5;margin-top:16px;}.cw-nav-bottom .cw-indicator{font-size:13px;font-weight:600;color:#7a6a5a;min-width:50px;text-align:center;}.cw-nav-bottom button{min-width:90px;}@media(max-width:768px){.cw-dot{width:24px;height:24px;font-size:11px;}.cw-nav-bottom button{min-width:70px;font-size:12px;padding:8px 14px;}}@media(max-width:480px){.cw-dot{width:20px;height:20px;font-size:10px;}.cw-dots-row{gap:5px;}.cw-nav-bottom{gap:6px;flex-wrap:wrap;}.cw-nav-bottom button{min-width:60px;font-size:11px;padding:7px 10px;}.cw-nav-bottom .cw-indicator{font-size:11px;min-width:36px;}.cw-page-label{font-size:11px;}}</style>'+rpn()+'<div class="cw-content" id="cwContent">'+rpc(0)+'</div><div class="cw-nav-bottom"><button class="sim-btn sim-btn-outline" id="cwPrevBtn" disabled>← 上一页</button><span class="cw-indicator" id="cwIndicator">1/'+totalPages+'</span><button class="sim-btn sim-btn-primary" id="cwNextBtn">下一页 →</button></div>';}
        const html=bHTML();
        const result=wrap(config.courseTitle+' — '+config.lessonTopic,html);
        return{html:result,init:function(container){
            const cwC=container.querySelector('#cwContent'),cwP=container.querySelector('#cwPrevBtn'),cwN=container.querySelector('#cwNextBtn'),cwI=container.querySelector('#cwIndicator');
            function unu(){container.querySelectorAll('.cw-dot').forEach((d,i)=>{d.className='cw-dot '+(i===currentPage?'active':(i<currentPage?'done':''));d.textContent=i<currentPage?'✓':(i+1);});const b=container.querySelector('.cw-progress-fill');if(b)b.style.width=((currentPage+1)/totalPages*100)+'%';const l=container.querySelector('.cw-page-label');if(l)l.textContent=pageTitles[currentPage];cwP.disabled=currentPage===0;if(currentPage>=totalPages-1){cwN.textContent='🎉 完成课程';cwN.className='sim-btn sim-btn-success';}else{cwN.textContent='下一页 →';cwN.className='sim-btn sim-btn-primary';}cwI.textContent=(currentPage+1)+'/'+totalPages;}
            function gtp(n){if(n<0||n>=totalPages)return;currentPage=n;cwC.innerHTML=rpc(n);unu();bpe(n);}
            function bpe(n){if(n===2&&config.labInit)config.labInit(container);if(n===3)bindQuiz();}
            function bindQuiz(){
                quizScore=0;let qr=0,qa=false;const qe=container.querySelector('#qzEmoji'),qq=container.querySelector('#qzQuestion'),qo=container.querySelector('#qzOptions'),qf=container.querySelector('#qzFeedback'),qs=container.querySelector('#qzScore'),qsb=container.querySelector('#qzStartBtn'),bank=config.quizBank;
                function nq(){if(qr>=bank.length){if(qe)qe.textContent=quizScore>=bank.length-1?'🏆':quizScore>=bank.length-2?'😊':'💪';if(qq)qq.textContent=quizScore>=bank.length-1?'太厉害了！':quizScore>=bank.length-2?'不错哦！':'继续加油~';if(qo)qo.innerHTML='';if(qf)qf.innerHTML=starBadge(quizScore,bank.length)+'<br><span style="font-size:14px;">'+quizScore+'/'+bank.length+' 分</span>';qa=false;if(qsb)qsb.textContent='🔄 再来一次';if(quizScore>=bank.length-1)toast('🏆 闯关成功！');return;}const q=bank[qr];qr++;if(qe)qe.textContent=q.emoji||'🎯';if(qq)qq.textContent='第'+qr+'题：'+q.q;if(qo)qo.innerHTML=q.opts.map((o,i)=>'<button class="sim-btn sim-btn-outline" data-qo="'+i+'" style="padding:12px;font-size:13px;">'+o+'</button>').join('');if(qf)qf.innerHTML='<span style="color:#7a6a5a;">选一个答案吧~</span>';qa=true;if(qo){qo.querySelectorAll('[data-qo]').forEach(btn=>{btn.onclick=function(){if(!qa)return;qa=false;const a=parseInt(this.dataset.qo);qo.querySelectorAll('[data-qo]').forEach(b=>b.disabled=true);if(a===q.ans){quizScore++;if(qs)qs.textContent=quizScore;if(qf)qf.innerHTML='<span style="color:#5cb85c;font-size:16px;">✅ 正确！'+(q.hint||'')+'</span>';toast('✅ 答对了！');}else{if(qf)qf.innerHTML='<span style="color:#e74c3c;font-size:14px;">❌ 应该是「'+q.opts[q.ans]+'」'+(q.hint?'。'+q.hint:'')+'</span>';toast('❌ 再想想~');}setTimeout(nq,1500);};})}}
                if(qsb)qsb.onclick=function(){quizScore=0;qr=0;if(qs)qs.textContent='0';if(qf)qf.innerHTML='';nq();this.textContent='⏳ 答题中...';};
                const qrb=container.querySelector('#qzResetBtn');if(qrb)qrb.onclick=function(){qa=false;quizScore=0;qr=0;if(qs)qs.textContent='0';if(qe)qe.textContent='🎯';if(qq)qq.textContent='准备开始挑战！';if(qo)qo.innerHTML='';if(qf)qf.innerHTML='';if(qsb)qsb.textContent='🎮 开始闯关';toast('🔄 已重置');};
            }
            cwP.addEventListener('click',()=>{if(currentPage>0)gtp(currentPage-1);});
            cwN.addEventListener('click',()=>{if(currentPage>=totalPages-1)toast('🎉 恭喜完成！');else gtp(currentPage+1);});
            container.querySelectorAll('.cw-dot').forEach(dot=>{dot.addEventListener('click',function(){const t=parseInt(this.dataset.goto);if(t<=currentPage||t===currentPage+1)gtp(t);});});
            unu();
        }};
    }

    // R05: 机器人编程与AI感知（9-12岁）— 4课×5页
    registry['5-1'] = () => createMultiPageSim({courseTitle:'机器人编程与AI感知',lessonTopic:'系统架构师',introIcon:'🏗️',
        introHTML:'<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🏗️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">一台机器人由<strong style="color:#1a2a6c;">传感器网络</strong>和<strong style="color:#e67e22;">控制器架构</strong>组成。<br>传感器负责"感知"，控制器负责"思考"，执行器负责"行动"。<br>设计一个好的<strong>系统架构</strong>是开发机器人的第一步！</p></div><div style="background:#fff;border-radius:16px;padding:14px;border:2px solid #e8e0d5;text-align:center;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;margin-bottom:8px;">💬 想一想</div><div style="font-size:13px;color:#4a3a2a;">如果一台机器人有8个传感器但只有1个控制器，会发生什么？</div></div>',
        knowledgeHTML:'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📡',title:'传感器层',desc:'摄像头、超声波、红外\n陀螺仪、触觉等',color:'#4a90d9'},{icon:'🧠',title:'控制器层',desc:'Arduino/Raspberry Pi\n运行主控程序',color:'#9b59b6'},{icon:'⚡',title:'执行器层',desc:'马达、舵机、LED\n蜂鸣器、显示屏等',color:'#e74c3c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:100px;background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;"><div style="font-size:13px;color:#4a3a2a;line-height:1.8;">架构设计原则：<strong>高内聚、低耦合</strong>——每个模块做好自己的事，模块间通过标准接口通信。</div></div>',
        labHTML:'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🏗️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">架构设计就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">传感器数量</div><input type="range" class="sim-slider" id="param_sensors" min="1" max="8" value="4" style="width:120px;"><div class="sim-value" id="val_sensors">4个</div></div><div style="text-align:center;"><div class="sim-label">执行器数量</div><input type="range" class="sim-slider" id="param_actuators" min="1" max="6" value="3" style="width:120px;"><div class="sim-value" id="val_actuators">3个</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 生成架构</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 系统架构设计工具就绪...</div>',
        labInit:function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_sensors').oninput=function(){c.querySelector('#val_sensors').textContent=this.value+'个';};c.querySelector('#param_actuators').oninput=function(){c.querySelector('#val_actuators').textContent=this.value+'个';};c.querySelector('#runSimBtn').onclick=function(){const sn=c.querySelector('#param_sensors').value,an=c.querySelector('#param_actuators').value;s.textContent='架构生成中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 生成架构图: '+sn+'个传感器 → 控制器 → '+an+'个执行器</div>';l.scrollTop=l.scrollHeight;toast('✅ 架构生成成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='架构设计就绪';c.querySelector('#param_sensors').value=4;c.querySelector('#val_sensors').textContent='4个';c.querySelector('#param_actuators').value=3;c.querySelector('#val_actuators').textContent='3个';l.innerHTML='📊 系统架构设计工具就绪...';toast('🔄 已重置');};},
        quizBank:[{q:'机器人系统架构中"控制器"的作用是？',opts:['采集信息','执行动作','判断决策','供电'],ans:2,emoji:'🧠',hint:'控制器=机器人的大脑'},{q:'传感器在架构中属于哪一层？',opts:['执行层','控制层','感知层','供电层'],ans:2,emoji:'📡',hint:'传感器负责感知环境'},{q:'良好的架构设计原则是？',opts:['全部混在一起','高内聚低耦合','越多越好','越少越好'],ans:1,emoji:'🏗️',hint:'模块化设计'},{q:'以下哪个不是执行器？',opts:['马达','舵机','摄像头','蜂鸣器'],ans:2,emoji:'⚡',hint:'摄像头是传感器'},{q:'架构设计的首要步骤是？',opts:['写代码','需求分析','买零件','测试'],ans:1,emoji:'📋',hint:'先分析需求再设计'}],
        summaryHTML:'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;margin:12px 0;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 机器人系统<strong>三层架构</strong>：感知→控制→执行<br>✅ 架构设计原则：<strong>模块化、标准化</strong></div></div>',
        nextHTML:'<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：用Python控制硬件！🐍</div></div>'
    });
    registry['5-2'] = () => createMultiPageSim({courseTitle:'机器人编程与AI感知',lessonTopic:'Python编程师',introIcon:'🐍',
        introHTML:'<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🐍💻</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">用<strong style="color:#1a2a6c;">Python</strong>写代码控制硬件！<br>几行代码就能让<strong>LED闪烁</strong>、让<strong>马达转动</strong>。<br>这就是<strong>软件控制硬件</strong>的魔法！</p></div>',
        knowledgeHTML:'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'💡',title:'数字输出',desc:'控制LED亮灭\nHIGH/LOW信号',color:'#f1c40f'},{icon:'📶',title:'PWM输出',desc:'控制马达速度\n0-100%占空比',color:'#e67e22'},{icon:'🔄',title:'循环控制',desc:'while/for循环\n让程序持续运行',color:'#4a90d9'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:100px;background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#1e1e2e;color:#cdd6f4;padding:14px;border-radius:12px;font-family:monospace;font-size:12px;text-align:left;">import machine<br>led = machine.Pin(13, machine.Pin.OUT)<br>led.value(1) <span style="color:#6c7086;"># LED亮</span></div>',
        labHTML:'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🐍</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">Python环境就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">LED频率</div><input type="range" class="sim-slider" id="param_freq" min="1" max="10" value="2" style="width:120px;"><div class="sim-value" id="val_freq">2Hz</div></div><div style="text-align:center;"><div class="sim-label">马达速度</div><input type="range" class="sim-slider" id="param_speed" min="0" max="100" value="50" style="width:120px;"><div class="sim-value" id="val_speed">50%</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 运行程序</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 Python编程环境就绪...</div>',
        labInit:function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_freq').oninput=function(){c.querySelector('#val_freq').textContent=this.value+'Hz';};c.querySelector('#param_speed').oninput=function(){c.querySelector('#val_speed').textContent=this.value+'%';};c.querySelector('#runSimBtn').onclick=function(){const f=c.querySelector('#param_freq').value,sp=c.querySelector('#param_speed').value;s.textContent='代码执行中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 执行: LED闪烁'+f+'Hz, 马达速度'+sp+'%</div>';l.scrollTop=l.scrollHeight;toast('✅ 程序运行成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='Python环境就绪';c.querySelector('#param_freq').value=2;c.querySelector('#val_freq').textContent='2Hz';c.querySelector('#param_speed').value=50;c.querySelector('#val_speed').textContent='50%';l.innerHTML='📊 Python编程环境就绪...';toast('🔄 已重置');};},
        quizBank:[{q:'Python中控制LED用什么信号？',opts:['模拟信号','数字信号','声音信号','光信号'],ans:1,emoji:'💡',hint:'HIGH/LOW=数字信号'},{q:'PWM可以用来控制什么？',opts:['LED亮灭','马达速度','传感器读取','以上都不是'],ans:1,emoji:'📶',hint:'PWM控制电压占空比'},{q:'Python硬件控制常用哪个库？',opts:['numpy','machine','pandas','flask'],ans:1,emoji:'🐍',hint:'machine库用于MicroPython'},{q:'PWM占空比50%意味着？',opts:['全速','半速','停止','加速'],ans:1,emoji:'🔢',hint:'一半时间通电'},{q:'循环语句的作用是？',opts:['只运行一次','让程序重复执行','关闭程序','保存文件'],ans:1,emoji:'🔄',hint:'循环=重复执行'}],
        summaryHTML:'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ Python可以<strong>直接控制硬件</strong><br>✅ 数字输出=开/关，PWM=调节强度</div></div>',
        nextHTML:'<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：传感器数据采集！📊</div></div>'
    });
    registry['5-3'] = () => createMultiPageSim({courseTitle:'机器人编程与AI感知',lessonTopic:'数据采集师',introIcon:'📊',
        introHTML:'<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">📊</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">机器人靠<strong style="color:#1a2a6c;">传感器</strong>感知世界！<br>超声波测距离、温度传感器检测环境——<br>这些数据就是机器人的<strong>"感知输入"</strong>。</p></div>',
        knowledgeHTML:'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📡',title:'距离传感器',desc:'超声波/红外/激光\n测量物体距离',color:'#4a90d9'},{icon:'🌡️',title:'环境传感器',desc:'温度/湿度/气压\n监测环境状态',color:'#e74c3c'},{icon:'📊',title:'数据采集',desc:'连续读取+存储\n实时显示+报警',color:'#5cb85c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:100px;background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
        labHTML:'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">📊</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">传感器待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">超声波距离</div><input type="range" class="sim-slider" id="param_dist" min="0" max="200" value="50" style="width:120px;"><div class="sim-value" id="val_dist">50cm</div></div><div style="text-align:center;"><div class="sim-label">温度</div><input type="range" class="sim-slider" id="param_temp" min="0" max="50" value="25" style="width:120px;"><div class="sim-value" id="val_temp">25°C</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 采集数据</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 数据采集系统就绪...</div>',
        labInit:function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_dist').oninput=function(){c.querySelector('#val_dist').textContent=this.value+'cm';};c.querySelector('#param_temp').oninput=function(){c.querySelector('#val_temp').textContent=this.value+'°C';};c.querySelector('#runSimBtn').onclick=function(){const d=c.querySelector('#param_dist').value,t=c.querySelector('#param_temp').value;s.textContent='数据采集中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 采集: 距离'+d+'cm, 温度'+t+'°C</div>';l.scrollTop=l.scrollHeight;toast('✅ 采集成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='传感器待机';c.querySelector('#param_dist').value=50;c.querySelector('#val_dist').textContent='50cm';c.querySelector('#param_temp').value=25;c.querySelector('#val_temp').textContent='25°C';l.innerHTML='📊 数据采集系统就绪...';toast('🔄 已重置');};},
        quizBank:[{q:'超声波传感器的工作原理是？',opts:['发射光波','发射声波+接收回波','测量温度','检测颜色'],ans:1,emoji:'📡',hint:'超声波=声波测距'},{q:'传感器数据采集的频率取决于？',opts:['电池电量','采样率设定','马达速度','LED亮度'],ans:1,emoji:'📊',hint:'采样率越高数据越密集'},{q:'以下哪个是模拟传感器？',opts:['按钮','红外测距','开关','LED'],ans:1,emoji:'📶',hint:'红外返回连续数值'},{q:'温度传感器通常用什么单位？',opts:['厘米','赫兹','摄氏度(°C)','分贝(dB)'],ans:2,emoji:'🌡️',hint:'温度用摄氏度'},{q:'数据采集系统需要什么？',opts:['只有传感器','传感器+ADC+处理器','只有处理器','只有ADC'],ans:1,emoji:'🔗',hint:'完整链路=传感器→ADC→处理器'}],
        summaryHTML:'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 传感器输出<strong>模拟或数字信号</strong><br>✅ 数据采集 = <strong>传感器+ADC+处理器</strong><br>✅ 采样率决定<strong>数据精度</strong></div></div>',
        nextHTML:'<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：AI视觉融合！👁️</div></div>'
    });
    registry['5-4'] = () => createMultiPageSim({courseTitle:'机器人编程与AI感知',lessonTopic:'AI融合工程师',introIcon:'👁️',
        introHTML:'<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">👁️🤖</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">把<strong style="color:#1a2a6c;">AI视觉模块</strong>集成到机器人上！<br>机器人不仅能"看到"东西——<br>还能<strong>识别分类</strong>，根据不同物体做不同反应！</p></div>',
        knowledgeHTML:'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📷',title:'图像采集',desc:'摄像头拍摄\n传给AI模型',color:'#4a90d9'},{icon:'🧠',title:'模型推理',desc:'CNN/YOLO识别\n输出类别+置信度',color:'#9b59b6'},{icon:'🎯',title:'决策执行',desc:'根据识别结果\n触发对应动作',color:'#5cb85c'}].map(c=>'<div class="cw-info-card" style="--cc:'+c.color+';flex:1;min-width:100px;background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
        labHTML:'<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">👁️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">AI模块待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">识别类别</div><input type="range" class="sim-slider" id="param_classes" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_classes">5类</div></div><div style="text-align:center;"><div class="sim-label">置信度阈值</div><input type="range" class="sim-slider" id="param_conf" min="50" max="99" value="80" style="width:120px;"><div class="sim-value" id="val_conf">80%</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 运行识别</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 AI视觉模块就绪...</div>',
        labInit:function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_classes').oninput=function(){c.querySelector('#val_classes').textContent=this.value+'类';};c.querySelector('#param_conf').oninput=function(){c.querySelector('#val_conf').textContent=this.value+'%';};c.querySelector('#runSimBtn').onclick=function(){const cl=c.querySelector('#param_classes').value,co=c.querySelector('#param_conf').value;s.textContent='识别中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 识别'+cl+'类物体, 置信度>'+co+'%</div>';l.scrollTop=l.scrollHeight;toast('✅ 识别完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='AI模块待机';c.querySelector('#param_classes').value=5;c.querySelector('#val_classes').textContent='5类';c.querySelector('#param_conf').value=80;c.querySelector('#val_conf').textContent='80%';l.innerHTML='📊 AI视觉模块就绪...';toast('🔄 已重置');};},
        quizBank:[{q:'AI视觉模型输出的置信度代表？',opts:['图片大小','识别可靠程度','处理速度','模型版本'],ans:1,emoji:'📊',hint:'置信度=有多确定'},{q:'物体识别常用的深度学习模型是？',opts:['GPT','YOLO','BERT','LSTM'],ans:1,emoji:'🧠',hint:'YOLO=实时目标检测'},{q:'提高置信度阈值会？',opts:['识别更多','识别更少但更准','速度变慢'],ans:1,emoji:'🎯',hint:'阈值高=要求更严格'},{q:'AI视觉融合的完整流程是？',opts:['识别→采集→行动','采集→识别→决策','决策→采集→识别'],ans:1,emoji:'🔄',hint:'先看→再认→最后做'},{q:'机器人识别到特定物体应？',opts:['忽略','执行对应动作','继续前进','关机'],ans:1,emoji:'🎯',hint:'识别结果驱动行为'}],
        summaryHTML:'<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;margin-bottom:10px;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ AI视觉=<strong>图像采集+模型推理+决策</strong><br>✅ 置信度阈值<strong>平衡准确率和召回率</strong></div></div>',
        nextHTML:'<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R05课程完成！下一课程：仿生机器人！🦎</div></div>'
    });

    // R06: 仿生机器人创意工坊（9-12岁）— 4课×5页
    (function(){
        const C='仿生机器人创意工坊';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['6-1']=mk('仿生设计师','🦎','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🦎</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">大自然是最好的设计师！<strong style="color:#1a2a6c;">仿生学</strong>就是从生物身上获取灵感——<br>蜘蛛腿→六足机器人、鱼尾巴→水下推进器。<br>观察自然，创造<strong>仿生机器人</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'👀',title:'观察生物',desc:'分析动物运动方式\n找出结构特点',color:'#4a90d9'},{icon:'✏️',title:'抽象设计',desc:'把生物结构\n转化为机械方案',color:'#e67e22'},{icon:'🔧',title:'工程实现',desc:'用舵机/连杆\n实现运动功能',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div><div style="background:#f0ede4;border-radius:16px;padding:14px;text-align:center;"><div style="font-size:13px;color:#4a3a2a;">仿生设计流程：<strong>观察→抽象→设计→实现→迭代</strong></div></div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🦎</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">仿生设计就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">腿数量</div><input type="range" class="sim-slider" id="param_legs" min="2" max="8" value="6" style="width:120px;"><div class="sim-value" id="val_legs">6条</div></div><div style="text-align:center;"><div class="sim-label">步频</div><input type="range" class="sim-slider" id="param_speed" min="1" max="10" value="4" style="width:120px;"><div class="sim-value" id="val_speed">4Hz</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 生成方案</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 仿生设计工具就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_legs').oninput=function(){c.querySelector('#val_legs').textContent=this.value+'条';};c.querySelector('#param_speed').oninput=function(){c.querySelector('#val_speed').textContent=this.value+'Hz';};c.querySelector('#runSimBtn').onclick=function(){const lg=c.querySelector('#param_legs').value,sp=c.querySelector('#param_speed').value;s.textContent='方案生成中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 仿生方案: '+lg+'足机器人, 步频'+sp+'Hz</div>';l.scrollTop=l.scrollHeight;toast('✅ 方案生成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='仿生设计就绪';c.querySelector('#param_legs').value=6;c.querySelector('#val_legs').textContent='6条';c.querySelector('#param_speed').value=4;c.querySelector('#val_speed').textContent='4Hz';l.innerHTML='📊 仿生设计工具就绪...';toast('🔄 已重置');};},
            [{q:'仿生学的核心思想是？',opts:['从生物身上获取灵感','完全复制生物','忽略生物结构','只用金属设计'],ans:0,emoji:'🦎',hint:'向大自然学习'},{q:'六足机器人的灵感来自？',opts:['鸟','鱼','昆虫','蛇'],ans:2,emoji:'🕷️',hint:'昆虫有6条腿'},{q:'仿生设计第一步是？',opts:['画图','观察生物','买零件','写代码'],ans:1,emoji:'👀',hint:'先观察再设计'},{q:'步频指的是什么？',opts:['腿的数量','每秒迈步次数','行走距离','电机功率'],ans:1,emoji:'🚶',hint:'步频=迈步频率'},{q:'仿生设计需要什么学科知识？',opts:['只有生物学','只有工程学','生物学+工程学','只有数学'],ans:2,emoji:'🔬',hint:'跨学科融合'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 仿生学=<strong>观察自然+工程实现</strong><br>✅ 不同生物结构启发<strong>不同机器人设计</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：六足机器人搭建！🕷️</div></div>');
        registry['6-2']=mk('六足机器人工程师','🕷️','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🕷️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">六足机器人走路比四轮车<strong style="color:#1a2a6c;">更稳定</strong>！<br>每条腿由<strong>舵机</strong>驱动，通过协调<strong>步态</strong>实现平稳行走。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🔧',title:'舵机控制',desc:'精确角度控制\n0-180°范围',color:'#e74c3c'},{icon:'🦶',title:'步态规划',desc:'三脚着地\n交替迈步',color:'#4a90d9'},{icon:'⚖️',title:'平衡控制',desc:'保持重心\n稳定行走',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🕷️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">六足机器人待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">步态模式</div><input type="range" class="sim-slider" id="param_gait" min="1" max="3" value="1" style="width:120px;"><div class="sim-value" id="val_gait">1</div></div><div style="text-align:center;"><div class="sim-label">身体高度</div><input type="range" class="sim-slider" id="param_height" min="20" max="80" value="50" style="width:120px;"><div class="sim-value" id="val_height">50mm</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始行走</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 六足控制系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_gait').oninput=function(){c.querySelector('#val_gait').textContent=this.value;};c.querySelector('#param_height').oninput=function(){c.querySelector('#val_height').textContent=this.value+'mm';};c.querySelector('#runSimBtn').onclick=function(){const g=c.querySelector('#param_gait').value,h=c.querySelector('#param_height').value;s.textContent='行走中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 步态'+g+', 高度'+h+'mm, 稳定行走</div>';l.scrollTop=l.scrollHeight;toast('✅ 行走成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='六足机器人待机';c.querySelector('#param_gait').value=1;c.querySelector('#val_gait').textContent='1';c.querySelector('#param_height').value=50;c.querySelector('#val_height').textContent='50mm';l.innerHTML='📊 六足控制系统就绪...';toast('🔄 已重置');};},
            [{q:'六足机器人用什么驱动腿？',opts:['马达','舵机','气缸','弹簧'],ans:1,emoji:'🔧',hint:'舵机精确控制角度'},{q:'六足行走时通常几条腿着地？',opts:['1条','2条','3条','6条'],ans:2,emoji:'🦶',hint:'三角形稳定支撑'},{q:'步态模式影响什么？',opts:['颜色','行走方式','重量','声音'],ans:1,emoji:'🚶',hint:'不同步态=不同行走方式'},{q:'舵机的控制范围通常是？',opts:['0-90°','0-180°','0-360°','任意角度'],ans:1,emoji:'📐',hint:'舵机=0-180°精确控制'},{q:'身体高度影响什么？',opts:['颜色','重心稳定性','速度','声音'],ans:1,emoji:'⚖️',hint:'越低越稳定'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 六足=<strong>6个舵机+步态协调</strong><br>✅ 三脚着地保证<strong>静态稳定</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：仿生鱼设计！🐟</div></div>');
        registry['6-3']=mk('仿生鱼设计师','🐟','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🐟</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">鱼靠<strong style="color:#1a2a6c;">摆动尾巴</strong>在水中前进！<br>仿生鱼用<strong>舵机驱动尾部</strong>，模拟鱼的游动方式——在水中高效推进。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🌊',title:'流体动力',desc:'水的阻力\n推动原理',color:'#4a90d9'},{icon:'🐟',title:'尾部摆动',desc:'频率+幅度\n决定推进力',color:'#e67e22'},{icon:'🎯',title:'方向控制',desc:'尾鳍偏转\n控制转向',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🐟</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">仿生鱼待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">摆尾频率</div><input type="range" class="sim-slider" id="param_freq" min="1" max="5" value="2" style="width:120px;"><div class="sim-value" id="val_freq">2Hz</div></div><div style="text-align:center;"><div class="sim-label">摆尾幅度</div><input type="range" class="sim-slider" id="param_amp" min="10" max="90" value="45" style="width:120px;"><div class="sim-value" id="val_amp">45°</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始游动</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 仿生鱼推进系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_freq').oninput=function(){c.querySelector('#val_freq').textContent=this.value+'Hz';};c.querySelector('#param_amp').oninput=function(){c.querySelector('#val_amp').textContent=this.value+'°';};c.querySelector('#runSimBtn').onclick=function(){const f=c.querySelector('#param_freq').value,a=c.querySelector('#param_amp').value;s.textContent='游动中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 摆尾'+f+'Hz, 幅度'+a+'°, 推进速度正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 游动成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='仿生鱼待机';c.querySelector('#param_freq').value=2;c.querySelector('#val_freq').textContent='2Hz';c.querySelector('#param_amp').value=45;c.querySelector('#val_amp').textContent='45°';l.innerHTML='📊 仿生鱼推进系统就绪...';toast('🔄 已重置');};},
            [{q:'仿生鱼的推进力来自？',opts:['轮子','尾部摆动','螺旋桨','喷气'],ans:1,emoji:'🐟',hint:'像鱼一样摆尾巴'},{q:'摆尾频率越高会？',opts:['速度越慢','速度越快','停下来','沉下去'],ans:1,emoji:'⚡',hint:'频率高=游得快'},{q:'摆尾幅度影响什么？',opts:['颜色','推进力大小','重量','声音'],ans:1,emoji:'📐',hint:'幅度大=推力大'},{q:'鱼在水中靠什么转弯？',opts:['轮子','身体偏转','螺旋桨','翅膀'],ans:1,emoji:'🎯',hint:'尾鳍偏转改变方向'},{q:'仿生鱼最适合什么环境？',opts:['沙漠','水下','空中','太空'],ans:1,emoji:'🌊',hint:'仿生鱼=水下机器人'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 仿生鱼=<strong>舵机+尾部+防水</strong><br>✅ 摆尾频率和幅度<strong>共同决定推进力</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：创意发明大赛！💡</div></div>');
        registry['6-4']=mk('创意发明家','💡','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">💡</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">综合所学的仿生知识——<br><strong style="color:#1a2a6c;">设计你自己的原创仿生机器人</strong>！<br>选择仿生类型，设定复杂度，展示你的创意！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🐾',title:'陆行',desc:'仿生腿式\n多足/双足',color:'#8B6914'},{icon:'🐟',title:'水游',desc:'仿生鱼类\n摆动推进',color:'#4a90d9'},{icon:'🦅',title:'飞行',desc:'仿生鸟类\n扑翼/滑翔',color:'#e74c3c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">💡</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">创意工坊就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">仿生类型</div><input type="range" class="sim-slider" id="param_type" min="1" max="4" value="1" style="width:120px;"><div class="sim-value" id="val_type">1</div></div><div style="text-align:center;"><div class="sim-label">复杂度</div><input type="range" class="sim-slider" id="param_complexity" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_complexity">5</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 生成创意</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 创意发明工坊就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_type').oninput=function(){c.querySelector('#val_type').textContent=this.value;};c.querySelector('#param_complexity').oninput=function(){c.querySelector('#val_complexity').textContent=this.value;};c.querySelector('#runSimBtn').onclick=function(){const t=c.querySelector('#param_type').value,co=c.querySelector('#param_complexity').value;s.textContent='设计中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 原创仿生机器人: 类型'+t+', 复杂度'+co+'</div>';l.scrollTop=l.scrollHeight;toast('✅ 创意生成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='创意工坊就绪';c.querySelector('#param_type').value=1;c.querySelector('#val_type').textContent='1';c.querySelector('#param_complexity').value=5;c.querySelector('#val_complexity').textContent='5';l.innerHTML='📊 创意发明工坊就绪...';toast('🔄 已重置');};},
            [{q:'仿生机器人设计灵感来自？',opts:['数学公式','自然界生物','科幻电影','教科书'],ans:1,emoji:'💡',hint:'向大自然学习'},{q:'复杂度的含义是？',opts:['机器人重量','设计难度和精细度','机器人颜色','电池大小'],ans:1,emoji:'📊',hint:'复杂度=设计难度'},{q:'一个好的仿生设计需要？',opts:['抄袭自然','理解原理+创新','忽略限制','只关注外观'],ans:1,emoji:'🎨',hint:'理解+创新'},{q:'仿生学属于什么学科交叉？',opts:['纯生物','纯机械','生物+工程','纯数学'],ans:2,emoji:'🔬',hint:'跨学科融合'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 仿生=<strong>观察→理解→设计→创新</strong><br>✅ 创意=<strong>理解原理+大胆想象</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R06课程完成！下一课程：智能家居！🏠</div></div>');
    })();

    // R07: 智能家居机器人（9-12岁）— 4课×5页
    (function(){
        const C='智能家居机器人';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['7-1']=mk('系统规划师','🏠','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🏠</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">未来的家是<strong style="color:#1a2a6c;">智能的</strong>！<br>灯光自动调节、空调智能控温、安防实时监控——<br>设计一个<strong>智能家居机器人系统</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📋',title:'需求分析',desc:'确定房间数\n设备类型',color:'#4a90d9'},{icon:'🔗',title:'系统设计',desc:'传感器+控制器\n+执行器方案',color:'#e67e22'},{icon:'✅',title:'方案评估',desc:'可行性分析\n成本与效益',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🏠</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">方案设计就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">房间数</div><input type="range" class="sim-slider" id="param_rooms" min="1" max="6" value="3" style="width:120px;"><div class="sim-value" id="val_rooms">3间</div></div><div style="text-align:center;"><div class="sim-label">设备数</div><input type="range" class="sim-slider" id="param_devices" min="1" max="20" value="8" style="width:120px;"><div class="sim-value" id="val_devices">8个</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 生成方案</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 智能家居设计工具就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_rooms').oninput=function(){c.querySelector('#val_rooms').textContent=this.value+'间';};c.querySelector('#param_devices').oninput=function(){c.querySelector('#val_devices').textContent=this.value+'个';};c.querySelector('#runSimBtn').onclick=function(){const r=c.querySelector('#param_rooms').value,d=c.querySelector('#param_devices').value;s.textContent='方案生成中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 方案: '+r+'个房间, '+d+'个智能设备</div>';l.scrollTop=l.scrollHeight;toast('✅ 方案生成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='方案设计就绪';c.querySelector('#param_rooms').value=3;c.querySelector('#val_rooms').textContent='3间';c.querySelector('#param_devices').value=8;c.querySelector('#val_devices').textContent='8个';l.innerHTML='📊 智能家居设计工具就绪...';toast('🔄 已重置');};},
            [{q:'智能家居系统的核心是？',opts:['灯泡','控制器','沙发','窗帘'],ans:1,emoji:'🧠',hint:'控制器=智能家居大脑'},{q:'设计智能家居第一步是？',opts:['买设备','需求分析','写代码','装修'],ans:1,emoji:'📋',hint:'先分析需求'},{q:'智能家居通常包含几个子系统？',opts:['1个','2-4个','10个','不需要'],ans:1,emoji:'🏠',hint:'照明/温控/安防等'},{q:'物联网(IoT)的核心是？',opts:['设备互联','用电池','要联网','以上都是'],ans:3,emoji:'🔗',hint:'IoT=万物互联'},{q:'智能家居的好处不包括？',opts:['省电','方便','让房子变大','安全'],ans:2,emoji:'🏠',hint:'智能≠变大'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 智能家居=<strong>传感器+控制器+IoT</strong><br>✅ 好方案从<strong>需求分析</strong>开始</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：环境监测系统！🌡️</div></div>');
        registry['7-2']=mk('环境监测师','🌡️','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🌡️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">多个传感器<strong style="color:#1a2a6c;">协同工作</strong>——<br>温度、湿度、光照同时监测，<br>构建完整的<strong>环境感知系统</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🌡️',title:'温湿度',desc:'DHT11/DHT22\n精度±0.5°C',color:'#e74c3c'},{icon:'💡',title:'光照',desc:'光敏电阻\n0-1000lux',color:'#f1c40f'},{icon:'📊',title:'数据显示',desc:'实时曲线\n超出阈值报警',color:'#4a90d9'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🌡️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">传感器待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">温度</div><input type="range" class="sim-slider" id="param_temp" min="10" max="40" value="25" style="width:100px;"><div class="sim-value" id="val_temp">25°C</div></div><div style="text-align:center;"><div class="sim-label">湿度</div><input type="range" class="sim-slider" id="param_humid" min="20" max="90" value="60" style="width:100px;"><div class="sim-value" id="val_humid">60%</div></div><div style="text-align:center;"><div class="sim-label">光照</div><input type="range" class="sim-slider" id="param_light" min="0" max="1000" value="500" style="width:100px;"><div class="sim-value" id="val_light">500lux</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 采集数据</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 环境监测系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');['temp','humid','light'].forEach(id=>{c.querySelector('#param_'+id).oninput=function(){const u=id==='temp'?'°C':id==='humid'?'%':'lux';c.querySelector('#val_'+id).textContent=this.value+u;};});c.querySelector('#runSimBtn').onclick=function(){const t=c.querySelector('#param_temp').value,h=c.querySelector('#param_humid').value,li=c.querySelector('#param_light').value;s.textContent='数据采集中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 环境: '+t+'°C, 湿度'+h+'%, 光照'+li+'lux</div>';l.scrollTop=l.scrollHeight;toast('✅ 采集成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='传感器待机';c.querySelector('#param_temp').value=25;c.querySelector('#val_temp').textContent='25°C';c.querySelector('#param_humid').value=60;c.querySelector('#val_humid').textContent='60%';c.querySelector('#param_light').value=500;c.querySelector('#val_light').textContent='500lux';l.innerHTML='📊 环境监测系统就绪...';toast('🔄 已重置');};},
            [{q:'DHT11是什么传感器？',opts:['距离','温湿度','光照','声音'],ans:1,emoji:'🌡️',hint:'DHT11=温湿度传感器'},{q:'光照强度的单位是？',opts:['°C','%','lux','Hz'],ans:2,emoji:'💡',hint:'光照=勒克斯(lux)'},{q:'环境监测需要几个传感器？',opts:['1个','2-3个及以上','0个','越多越好'],ans:1,emoji:'📊',hint:'多种传感器协同'},{q:'温湿度传感器用什么通信协议？',opts:['WiFi','I2C/单总线','HDMI','USB'],ans:1,emoji:'🔌',hint:'I2C=传感器常用协议'},{q:'超出阈值应该做什么？',opts:['忽略','报警通知','关机','删除数据'],ans:1,emoji:'🚨',hint:'超阈值=异常=报警'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 环境监测=<strong>多传感器+数据融合</strong><br>✅ 每种传感器有<strong>自己的通信协议</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：语音交互！🎤</div></div>');
        registry['7-3']=mk('语音交互设计师','🎤','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🎤</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">"开灯！""关窗！"——<br>用<strong style="color:#1a2a6c;">语音</strong>控制智能家居设备！<br>语音识别+自然语言理解=智能交互。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🎤',title:'语音采集',desc:'麦克风采集\n降噪处理',color:'#4a90d9'},{icon:'🧠',title:'语音识别',desc:'ASR转文字\nNLU理解意图',color:'#9b59b6'},{icon:'🔊',title:'语音合成',desc:'TTS播报反馈\n自然语音输出',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🎤</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">语音系统待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">指令数</div><input type="range" class="sim-slider" id="param_cmds" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_cmds">5条</div></div><div style="text-align:center;"><div class="sim-label">音量</div><input type="range" class="sim-slider" id="param_vol" min="0" max="100" value="70" style="width:120px;"><div class="sim-value" id="val_vol">70%</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 语音识别</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 语音交互系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_cmds').oninput=function(){c.querySelector('#val_cmds').textContent=this.value+'条';};c.querySelector('#param_vol').oninput=function(){c.querySelector('#val_vol').textContent=this.value+'%';};c.querySelector('#runSimBtn').onclick=function(){const cd=c.querySelector('#param_cmds').value,v=c.querySelector('#param_vol').value;s.textContent='语音识别中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 识别'+cd+'条指令, 音量'+v+'%</div>';l.scrollTop=l.scrollHeight;toast('✅ 识别成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='语音系统待机';c.querySelector('#param_cmds').value=5;c.querySelector('#val_cmds').textContent='5条';c.querySelector('#param_vol').value=70;c.querySelector('#val_vol').textContent='70%';l.innerHTML='📊 语音交互系统就绪...';toast('🔄 已重置');};},
            [{q:'ASR是什么意思？',opts:['语音合成','自动语音识别','图像识别','机器人控制'],ans:1,emoji:'🎤',hint:'ASR=语音转文字'},{q:'语音交互的第一步是？',opts:['说话','采集+降噪','执行命令','反馈'],ans:1,emoji:'🎤',hint:'先用麦克风采集'},{q:'TTS的功能是？',opts:['语音识别','文字转语音','图像识别','马达控制'],ans:1,emoji:'🔊',hint:'TTS=机器说话'},{q:'语音指令越多需要什么？',opts:['更大的电池','更强的NLU模型','更多LED','更快的马达'],ans:1,emoji:'🧠',hint:'需要更好的理解能力'},{q:'智能音箱用的核心技术是？',opts:['蓝牙','语音交互','WiFi','电池'],ans:1,emoji:'🔊',hint:'核心=语音交互'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 语音交互=<strong>ASR+NLU+TTS</strong><br>✅ 麦克风→识别→理解→执行→播报</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：安防系统！🔒</div></div>');
        registry['7-4']=mk('安防系统工程师','🔒','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🔒</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">安全第一！<strong style="color:#1a2a6c;">安防系统</strong>是智能家居的重要部分。<br>多防区监控、入侵检测、自动报警——<strong>保护家的安全</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🚪',title:'防区划分',desc:'门窗/走廊/阳台\n独立监控区域',color:'#e74c3c'},{icon:'📷',title:'检测手段',desc:'红外/摄像头\n门窗磁传感器',color:'#4a90d9'},{icon:'🚨',title:'报警联动',desc:'触发→声光报警\n+手机推送',color:'#f1c40f'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🔒</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">安防系统待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">防区数</div><input type="range" class="sim-slider" id="param_zones" min="1" max="8" value="4" style="width:120px;"><div class="sim-value" id="val_zones">4个</div></div><div style="text-align:center;"><div class="sim-label">灵敏度</div><input type="range" class="sim-slider" id="param_sensitivity" min="1" max="10" value="7" style="width:120px;"><div class="sim-value" id="val_sensitivity">7</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 安防检测</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 安防系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_zones').oninput=function(){c.querySelector('#val_zones').textContent=this.value+'个';};c.querySelector('#param_sensitivity').oninput=function(){c.querySelector('#val_sensitivity').textContent=this.value;};c.querySelector('#runSimBtn').onclick=function(){const z=c.querySelector('#param_zones').value,se=c.querySelector('#param_sensitivity').value;s.textContent='安防检测中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+z+'个防区, 灵敏度'+se+', 系统正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 安防检测完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='安防系统待机';c.querySelector('#param_zones').value=4;c.querySelector('#val_zones').textContent='4个';c.querySelector('#param_sensitivity').value=7;c.querySelector('#val_sensitivity').textContent='7';l.innerHTML='📊 安防系统就绪...';toast('🔄 已重置');};},
            [{q:'安防系统最核心的功能是？',opts:['播放音乐','检测入侵并报警','控制灯光','调节温度'],ans:1,emoji:'🚨',hint:'安全=检测+报警'},{q:'防区指的是什么？',opts:['一个房间','独立监控的区域','整栋楼','一个传感器'],ans:1,emoji:'🚪',hint:'防区=监控分区'},{q:'灵敏度越高意味着？',opts:['更容易误报','更难触发','更省电','更快'],ans:0,emoji:'🎯',hint:'高灵敏度=敏感'},{q:'安防系统通常用什么传感器？',opts:['只有摄像头','红外+门磁+摄像头','只有门磁','温度传感器'],ans:1,emoji:'📷',hint:'多种传感器组合'},{q:'系统联调的意思是？',opts:['单独测试','所有子系统联合调试','写代码','买零件'],ans:1,emoji:'🔗',hint:'联调=整体测试'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 安防=<strong>检测+判断+报警</strong><br>✅ 系统联调确保<strong>所有模块协同</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R07课程完成！下一课程：竞技机器人！🏆</div></div>');
    })();

    // R08: 竞技机器人（9-12岁）— 4课×5页
    (function(){
        const C='竞技机器人';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['8-1']=mk('循迹算法师','🏁','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🏁</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">让机器人<strong style="color:#1a2a6c;">沿着黑线走</strong>！<br>这就是<strong>循迹</strong>——机器人竞赛的必备技能。<br>PID算法让机器人稳定沿着轨迹线行驶！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'👁️',title:'检测偏差',desc:'红外传感器\n检测黑线位置',color:'#4a90d9'},{icon:'📐',title:'PID计算',desc:'P比例+I积分+D微分\n计算修正量',color:'#e67e22'},{icon:'🔧',title:'执行修正',desc:'调整左右轮速\n回到轨迹线上',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🏁</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">循迹系统待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">Kp参数</div><input type="range" class="sim-slider" id="param_kp" min="1" max="20" value="10" style="width:100px;"><div class="sim-value" id="val_kp">10</div></div><div style="text-align:center;"><div class="sim-label">Kd参数</div><input type="range" class="sim-slider" id="param_kd" min="1" max="20" value="5" style="width:100px;"><div class="sim-value" id="val_kd">5</div></div><div style="text-align:center;"><div class="sim-label">速度</div><input type="range" class="sim-slider" id="param_speed" min="10" max="100" value="60" style="width:100px;"><div class="sim-value" id="val_speed">60%</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始循迹</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 PID循迹系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');['kp','kd','speed'].forEach(id=>{c.querySelector('#param_'+id).oninput=function(){c.querySelector('#val_'+id).textContent=this.value+(id==='speed'?'%':'');};});c.querySelector('#runSimBtn').onclick=function(){const kp=c.querySelector('#param_kp').value,kd=c.querySelector('#param_kd').value,sp=c.querySelector('#param_speed').value;s.textContent='循迹中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ PID: Kp='+kp+', Kd='+kd+', 速度'+sp+'%, 稳定循迹</div>';l.scrollTop=l.scrollHeight;toast('✅ 循迹成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='循迹系统待机';c.querySelector('#param_kp').value=10;c.querySelector('#val_kp').textContent='10';c.querySelector('#param_kd').value=5;c.querySelector('#val_kd').textContent='5';c.querySelector('#param_speed').value=60;c.querySelector('#val_speed').textContent='60%';l.innerHTML='📊 PID循迹系统就绪...';toast('🔄 已重置');};},
            [{q:'PID中的P代表什么？',opts:['功率','比例(Proportional)','位置','电源'],ans:1,emoji:'📐',hint:'P=比例控制'},{q:'循迹用什么传感器检测黑线？',opts:['超声波','红外','摄像头','温度'],ans:1,emoji:'👁️',hint:'红外检测黑白差异'},{q:'Kp参数过大可能导致？',opts:['更稳定','震荡','停止','加速'],ans:1,emoji:'📈',hint:'Kp太大=修正过度'},{q:'D(微分)项的作用是？',opts:['消除稳态误差','预测趋势','加速响应','减小误差'],ans:1,emoji:'🔮',hint:'D=预测变化趋势'},{q:'循迹竞赛的关键是？',opts:['速度最快','又稳又快','只求稳','只求快'],ans:1,emoji:'🏁',hint:'平衡速度与稳定性'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ PID=<strong>P比例+I积分+D微分</strong><br>✅ Kp/Ki/Kd参数需要<strong>反复调试</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：智能避障！🚧</div></div>');
        registry['8-2']=mk('避障算法师','🚧','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🚧</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">赛道上不光有轨迹线——<strong style="color:#1a2a6c;">还有障碍物</strong>！<br>多传感器融合避障让机器人<strong>自动绕开</strong>障碍。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📡',title:'检测',desc:'超声波+红外\n多角度扫描',color:'#4a90d9'},{icon:'🧠',title:'判断',desc:'分析障碍大小\n选择绕行方向',color:'#e67e22'},{icon:'🔄',title:'执行',desc:'调整路径\n绕过障碍',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🚧</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">避障系统待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">检测距离</div><input type="range" class="sim-slider" id="param_range" min="10" max="100" value="30" style="width:120px;"><div class="sim-value" id="val_range">30cm</div></div><div style="text-align:center;"><div class="sim-label">策略</div><input type="range" class="sim-slider" id="param_strategy" min="1" max="3" value="1" style="width:120px;"><div class="sim-value" id="val_strategy">1</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 避障测试</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 避障系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_range').oninput=function(){c.querySelector('#val_range').textContent=this.value+'cm';};c.querySelector('#param_strategy').oninput=function(){c.querySelector('#val_strategy').textContent=this.value;};c.querySelector('#runSimBtn').onclick=function(){const r=c.querySelector('#param_range').value,st=c.querySelector('#param_strategy').value;s.textContent='避障中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 检测距离'+r+'cm, 策略'+st+', 成功避障</div>';l.scrollTop=l.scrollHeight;toast('✅ 避障成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='避障系统待机';c.querySelector('#param_range').value=30;c.querySelector('#val_range').textContent='30cm';c.querySelector('#param_strategy').value=1;c.querySelector('#val_strategy').textContent='1';l.innerHTML='📊 避障系统就绪...';toast('🔄 已重置');};},
            [{q:'避障需要什么传感器？',opts:['只有摄像头','超声波+红外','只有红外','温度传感器'],ans:1,emoji:'📡',hint:'多种传感器融合'},{q:'检测距离越远，机器人？',opts:['反应越快','反应越慢','越早开始避障','不变'],ans:2,emoji:'👁️',hint:'看得远=早准备'},{q:'避障策略的选择取决于？',opts:['颜色','障碍类型和位置','重量','温度'],ans:1,emoji:'🧠',hint:'根据障碍情况选择'},{q:'多传感器融合的好处是？',opts:['更贵','更可靠','更重','更慢'],ans:1,emoji:'🔗',hint:'融合=更全面准确'},{q:'避障算法的输出是？',opts:['温度值','避障方向+速度','颜色值','声音'],ans:1,emoji:'🎯',hint:'输出=运动指令'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 避障=<strong>检测+决策+绕行</strong><br>✅ 多传感器融合=<strong>更可靠</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：竞赛策略！📋</div></div>');
        registry['8-3']=mk('竞赛策略师','📋','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">📋</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">机器人竞赛不光比<strong style="color:#1a2a6c;">技术</strong>，还比<strong style="color:#e67e22;">策略</strong>！<br>攻守平衡、资源分配、时机把握——<br>好的策略让你事半功倍！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'⚔️',title:'攻击策略',desc:'主动出击\n占据优势位置',color:'#e74c3c'},{icon:'🛡️',title:'防守策略',desc:'稳固防守\n等待对手失误',color:'#4a90d9'},{icon:'⚖️',title:'平衡策略',desc:'攻守兼备\n灵活应变',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">📋</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">策略设计就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">攻击性</div><input type="range" class="sim-slider" id="param_attack" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_attack">5</div></div><div style="text-align:center;"><div class="sim-label">防御性</div><input type="range" class="sim-slider" id="param_defense" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_defense">5</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 生成策略</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 策略设计工具就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');['attack','defense'].forEach(id=>{c.querySelector('#param_'+id).oninput=function(){c.querySelector('#val_'+id).textContent=this.value;};});c.querySelector('#runSimBtn').onclick=function(){const a=c.querySelector('#param_attack').value,d=c.querySelector('#param_defense').value;s.textContent='策略生成中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 策略: 攻击'+a+', 防御'+d+'</div>';l.scrollTop=l.scrollHeight;toast('✅ 策略生成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='策略设计就绪';c.querySelector('#param_attack').value=5;c.querySelector('#val_attack').textContent='5';c.querySelector('#param_defense').value=5;c.querySelector('#val_defense').textContent='5';l.innerHTML='📊 策略设计工具就绪...';toast('🔄 已重置');};},
            [{q:'机器人竞赛策略的核心是？',opts:['攻守平衡','只攻不守','只守不攻','随机行动'],ans:0,emoji:'⚖️',hint:'平衡=最优策略'},{q:'攻击性过高可能导致？',opts:['得分更多','防守薄弱','更稳定','更省电'],ans:1,emoji:'⚔️',hint:'攻高=守低'},{q:'好的竞赛策略应该？',opts:['固定不变','根据对手调整','只考虑自己','随机的'],ans:1,emoji:'🧠',hint:'策略=灵活应变'},{q:'比赛前最重要做什么？',opts:['睡觉','研究规则和对手','买零食','换电池'],ans:1,emoji:'📋',hint:'知己知彼'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 竞赛=<strong>技术+策略+心理</strong><br>✅ 好的策略=攻守平衡+灵活应变</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：模拟竞赛实战！🏆</div></div>');
        registry['8-4']=mk('竞赛选手','🏆','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🏆</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">综合运用<strong style="color:#1a2a6c;">循迹+避障+策略</strong>——<br>在模拟竞赛中完成所有任务！<br>检验你的<strong>综合竞技能力</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🏁',title:'循迹',desc:'沿轨迹行驶\n不偏离路线',color:'#4a90d9'},{icon:'🚧',title:'避障',desc:'遇到障碍\n自动绕行',color:'#e67e22'},{icon:'⏰',title:'计时',desc:'争分夺秒 完成所有任务',color:'#e74c3c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🏆</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">竞赛就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">圈数</div><input type="range" class="sim-slider" id="param_laps" min="1" max="5" value="3" style="width:120px;"><div class="sim-value" id="val_laps">3圈</div></div><div style="text-align:center;"><div class="sim-label">障碍数</div><input type="range" class="sim-slider" id="param_obstacles" min="0" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_obstacles">5个</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始竞赛</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 竞赛系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_laps').oninput=function(){c.querySelector('#val_laps').textContent=this.value+'圈';};c.querySelector('#param_obstacles').oninput=function(){c.querySelector('#val_obstacles').textContent=this.value+'个';};c.querySelector('#runSimBtn').onclick=function(){const la=c.querySelector('#param_laps').value,o=c.querySelector('#param_obstacles').value;s.textContent='竞赛中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+la+'圈, '+o+'个障碍, 竞赛完成！🏆</div>';l.scrollTop=l.scrollHeight;toast('🏆 竞赛完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='竞赛就绪';c.querySelector('#param_laps').value=3;c.querySelector('#val_laps').textContent='3圈';c.querySelector('#param_obstacles').value=5;c.querySelector('#val_obstacles').textContent='5个';l.innerHTML='📊 竞赛系统就绪...';toast('🔄 已重置');};},
            [{q:'竞赛中最关键的是什么？',opts:['速度最快','综合能力','只有循迹','只有避障'],ans:1,emoji:'🏆',hint:'综合=循迹+避障+策略'},{q:'赛前需要检查什么？',opts:['电池电量','传感器校准','程序参数','以上都是'],ans:3,emoji:'✅',hint:'赛前全面检查'},{q:'圈数越多越考验什么？',opts:['稳定性','速度','电池','以上都是'],ans:3,emoji:'🔄',hint:'圈数=综合考验'},{q:'竞赛中遇到意外应该？',opts:['放弃','冷静应对','哭','找裁判'],ans:1,emoji:'🧠',hint:'冷静=最佳选择'},{q:'模拟竞赛的意义是？',opts:['浪费时间','赛前练兵发现不足','好玩','不需要'],ans:1,emoji:'🎯',hint:'模拟=赛前准备'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 竞赛=循迹+避障+策略+<strong>心理素质</strong><br>✅ 模拟实战发现不足+<strong>持续改进</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R08课程完成！进入高阶课程：ROS机器人！🚀</div></div>');
    })();

    // R09: 机器人底层开发与AI核心（13+岁）— 4课×5页
    (function(){
        const C='机器人底层开发与AI核心';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['9-1']=mk('ROS系统工程师','🔗','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🔗</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;"><strong style="color:#1a2a6c;">ROS(Robot Operating System)</strong>是机器人开发的标准平台。<br>它把机器人功能拆成<strong>节点</strong>，节点间通过<strong>话题/服务</strong>通信。<br>掌握ROS=掌握机器人开发的<strong>核心技能</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📦',title:'节点(Node)',desc:'独立功能单元\n一个节点=一个任务',color:'#4a90d9'},{icon:'💬',title:'话题(Topic)',desc:'节点间发布/订阅\n异步消息通信',color:'#e67e22'},{icon:'🔧',title:'服务(Service)',desc:'请求/响应模式\n同步调用',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🔗</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">ROS系统就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">节点数</div><input type="range" class="sim-slider" id="param_nodes" min="2" max="10" value="3" style="width:120px;"><div class="sim-value" id="val_nodes">3个</div></div><div style="text-align:center;"><div class="sim-label">通信频率</div><input type="range" class="sim-slider" id="param_rate" min="10" max="100" value="50" style="width:120px;"><div class="sim-value" id="val_rate">50Hz</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 启动通信</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 ROS系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_nodes').oninput=function(){c.querySelector('#val_nodes').textContent=this.value+'个';};c.querySelector('#param_rate').oninput=function(){c.querySelector('#val_rate').textContent=this.value+'Hz';};c.querySelector('#runSimBtn').onclick=function(){const n=c.querySelector('#param_nodes').value,r=c.querySelector('#param_rate').value;s.textContent='节点通信中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+n+'个节点, 频率'+r+'Hz, 通信正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 通信正常！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='ROS系统就绪';c.querySelector('#param_nodes').value=3;c.querySelector('#val_nodes').textContent='3个';c.querySelector('#param_rate').value=50;c.querySelector('#val_rate').textContent='50Hz';l.innerHTML='📊 ROS系统就绪...';toast('🔄 已重置');};},
            [{q:'ROS的全称是？',opts:['Robot OS','Robot Operating System','Remote OS','Rapid OS'],ans:1,emoji:'🤖',hint:'ROS=机器人操作系统'},{q:'ROS中功能单元叫什么？',opts:['进程','节点(Node)','线程','模块'],ans:1,emoji:'📦',hint:'ROS=节点化架构'},{q:'节点间异步通信用什么？',opts:['服务','话题(Topic)','文件','数据库'],ans:1,emoji:'💬',hint:'话题=发布/订阅'},{q:'ROS通信频率单位是？',opts:['秒','Hz','米','度'],ans:1,emoji:'⏱️',hint:'频率=每秒次数=Hz'},{q:'ROS的优势是什么？',opts:['分布式架构','模块化','开源社区','以上都是'],ans:3,emoji:'✅',hint:'ROS=分布式+模块化+开源'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ ROS=<strong>节点化+话题通信+服务调用</strong><br>✅ 分布式架构让复杂机器人<strong>模块化开发</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：SLAM建图！🗺️</div></div>');
        registry['9-2']=mk('SLAM建图师','🗺️','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🗺️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;"><strong style="color:#1a2a6c;">SLAM</strong>(Simultaneous Localization And Mapping)——<br>机器人在<strong>陌生环境</strong>中边移动边<strong>画地图</strong>！<br>这是自主导航的<strong>核心基础</strong>。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📍',title:'定位',desc:'我在哪里？\n里程计+IMU+GPS',color:'#4a90d9'},{icon:'🗺️',title:'建图',desc:'环境长什么样？\n激光雷达+视觉',color:'#e67e22'},{icon:'🔄',title:'闭环',desc:'来过这里！\n回环检测+优化',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🗺️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">SLAM待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">分辨率</div><input type="range" class="sim-slider" id="param_resolution" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_resolution">5cm</div></div><div style="text-align:center;"><div class="sim-label">建图面积</div><input type="range" class="sim-slider" id="param_area" min="10" max="100" value="30" style="width:120px;"><div class="sim-value" id="val_area">30m²</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始建图</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 SLAM系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_resolution').oninput=function(){c.querySelector('#val_resolution').textContent=this.value+'cm';};c.querySelector('#param_area').oninput=function(){c.querySelector('#val_area').textContent=this.value+'m²';};c.querySelector('#runSimBtn').onclick=function(){const r=c.querySelector('#param_resolution').value,a=c.querySelector('#param_area').value;s.textContent='建图中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 分辨率'+r+'cm, 面积'+a+'m², 建图完成</div>';l.scrollTop=l.scrollHeight;toast('✅ 建图完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='SLAM待机';c.querySelector('#param_resolution').value=5;c.querySelector('#val_resolution').textContent='5cm';c.querySelector('#param_area').value=30;c.querySelector('#val_area').textContent='30m²';l.innerHTML='📊 SLAM系统就绪...';toast('🔄 已重置');};},
            [{q:'SLAM的全称是什么？',opts:['Self Localization And Mapping','Simultaneous Localization And Mapping','Simple Location And Map','Sensor Location And Motion'],ans:1,emoji:'🗺️',hint:'同步定位与建图'},{q:'SLAM主要解决什么问题？',opts:['只有定位','只有建图','同时定位+建图','通信'],ans:2,emoji:'🎯',hint:'SLAM=定位+建图'},{q:'建图分辨率越高意味着？',opts:['地图越粗糙','地图越精细','建图越快','内存越小'],ans:1,emoji:'📐',hint:'分辨率高=细节多'},{q:'回环检测的作用是？',opts:['发现来过的地方','加速建图','省电','通信'],ans:0,emoji:'🔄',hint:'回环=纠正累积误差'},{q:'SLAM常用什么传感器？',opts:['只有摄像头','激光雷达','IMU+激光+视觉','只有GPS'],ans:2,emoji:'📡',hint:'多传感器融合'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ SLAM=<strong>定位+建图+闭环优化</strong><br>✅ 分辨率与精度的<strong>权衡</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：深度学习目标检测！🧠</div></div>');
        registry['9-3']=mk('深度学习工程师','🧠','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🧠</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">部署<strong style="color:#1a2a6c;">YOLO</strong>深度学习模型——<br>让机器人<strong>实时检测</strong>周围的人和物体！<br>深度学习+机器人=真正的<strong>智能体</strong>。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🏗️',title:'模型架构',desc:'CNN卷积网络\n提取图像特征',color:'#4a90d9'},{icon:'🎯',title:'目标检测',desc:'框出物体+分类\n输出坐标+标签',color:'#e74c3c'},{icon:'⚡',title:'实时推理',desc:'GPU加速\n30fps+实时检测',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🧠</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">YOLO待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">模型版本</div><input type="range" class="sim-slider" id="param_model" min="3" max="8" value="5" style="width:120px;"><div class="sim-value" id="val_model">5</div></div><div style="text-align:center;"><div class="sim-label">帧率</div><input type="range" class="sim-slider" id="param_fps" min="10" max="60" value="30" style="width:120px;"><div class="sim-value" id="val_fps">30fps</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 运行检测</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 YOLO模型就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_model').oninput=function(){c.querySelector('#val_model').textContent=this.value;};c.querySelector('#param_fps').oninput=function(){c.querySelector('#val_fps').textContent=this.value+'fps';};c.querySelector('#runSimBtn').onclick=function(){const m=c.querySelector('#param_model').value,f=c.querySelector('#param_fps').value;s.textContent='检测中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ YOLOv'+m+', '+f+'fps, 实时检测正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 检测正常！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='YOLO待机';c.querySelector('#param_model').value=5;c.querySelector('#val_model').textContent='5';c.querySelector('#param_fps').value=30;c.querySelector('#val_fps').textContent='30fps';l.innerHTML='📊 YOLO模型就绪...';toast('🔄 已重置');};},
            [{q:'YOLO是什么？',opts:['音乐播放器','实时目标检测模型','编程语言','操作系统'],ans:1,emoji:'🧠',hint:'YOLO=You Only Look Once'},{q:'深度学习模型推理需要什么硬件？',opts:['CPU足够','GPU加速','键盘','鼠标'],ans:1,emoji:'⚡',hint:'GPU=并行计算加速'},{q:'帧率(fps)越高意味着？',opts:['更清晰','更流畅','更省电','更小'],ans:1,emoji:'🎬',hint:'fps=每秒帧数'},{q:'CNN在图像中的作用是？',opts:['提取特征','播放音乐','控制马达','通信'],ans:0,emoji:'🏗️',hint:'CNN=卷积神经网络'},{q:'YOLO的优势是什么？',opts:['慢但准','实时+高精度','只能检测人脸','需要训练'],ans:1,emoji:'🎯',hint:'YOLO=快+准'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ YOLO=<strong>端到端实时目标检测</strong><br>✅ 深度学习部署需要<strong>GPU加速</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：自主导航综合项目！🧭</div></div>');
        registry['9-4']=mk('自主导航专家','🧭','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🧭</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">综合<strong style="color:#1a2a6c;">SLAM建图+路径规划+避障</strong>——<br>机器人从A到B<strong>完全自主</strong>导航！<br>这是机器人技术的<strong>终极挑战</strong>之一。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🗺️',title:'建图定位',desc:'SLAM建全局地图\nAMCL定位',color:'#4a90d9'},{icon:'📐',title:'路径规划',desc:'A*全局路径\nDWA局部避障',color:'#e67e22'},{icon:'🎯',title:'执行到达',desc:'控制马达执行\n到达目标点',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🧭</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">导航系统待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">路径点数</div><input type="range" class="sim-slider" id="param_waypoints" min="2" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_waypoints">5个</div></div><div style="text-align:center;"><div class="sim-label">避障距离</div><input type="range" class="sim-slider" id="param_avoid" min="10" max="50" value="20" style="width:120px;"><div class="sim-value" id="val_avoid">20cm</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始导航</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 自主导航系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_waypoints').oninput=function(){c.querySelector('#val_waypoints').textContent=this.value+'个';};c.querySelector('#param_avoid').oninput=function(){c.querySelector('#val_avoid').textContent=this.value+'cm';};c.querySelector('#runSimBtn').onclick=function(){const w=c.querySelector('#param_waypoints').value,a=c.querySelector('#param_avoid').value;s.textContent='导航中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+w+'个路径点, 避障'+a+'cm, 导航完成</div>';l.scrollTop=l.scrollHeight;toast('✅ 导航完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='导航系统待机';c.querySelector('#param_waypoints').value=5;c.querySelector('#val_waypoints').textContent='5个';c.querySelector('#param_avoid').value=20;c.querySelector('#val_avoid').textContent='20cm';l.innerHTML='📊 自主导航系统就绪...';toast('🔄 已重置');};},
            [{q:'自主导航的第一步是？',opts:['前进','建图+定位','转弯','停车'],ans:1,emoji:'🗺️',hint:'先知道自己在哪'},{q:'A*算法用于什么？',opts:['局部避障','全局路径规划','物体识别','语音识别'],ans:1,emoji:'📐',hint:'A*=全局最短路径'},{q:'DWA是什么算法？',opts:['全局规划','局部避障','图像处理','语音识别'],ans:1,emoji:'🚧',hint:'DWA=动态窗口避障'},{q:'避障距离设置太小会？',opts:['更安全','容易碰撞','更快','更慢'],ans:1,emoji:'⚠️',hint:'距离小=碰撞风险高'},{q:'自主导航完整技术栈是？',opts:['只有SLAM','SLAM+规划+控制','只有规划','只有控制'],ans:1,emoji:'🧭',hint:'导航=感知+规划+控制'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 自主导航=<strong>SLAM+A*+DWA</strong><br>✅ 全局规划+局部避障=完整导航</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R09课程完成！下一课程：人形机器人！🦾</div></div>');
    })();

    // R10: 人形机器人开发（13+岁）— 4课×5页
    (function(){
        const C='人形机器人开发';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['10-1']=mk('运动学分析师','📐','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">📐</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">人形机器人的手臂怎么动？<br><strong style="color:#1a2a6c;">运动学</strong>告诉你关节角度和末端位置的关系！<br>正运动学：角度→位置 | 逆运动学：位置→角度</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📐',title:'正运动学',desc:'给定关节角度\n计算末端坐标',color:'#4a90d9'},{icon:'🔄',title:'逆运动学',desc:'给定末端位置\n反算关节角度',color:'#e67e22'},{icon:'🎯',title:'工作空间',desc:'机械臂能到达的\n所有位置集合',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">📐</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">运动学计算就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">关节1角度</div><input type="range" class="sim-slider" id="param_joint1" min="0" max="180" value="45" style="width:100px;"><div class="sim-value" id="val_joint1">45°</div></div><div style="text-align:center;"><div class="sim-label">关节2角度</div><input type="range" class="sim-slider" id="param_joint2" min="0" max="180" value="90" style="width:100px;"><div class="sim-value" id="val_joint2">90°</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 计算位置</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 运动学计算工具就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');['joint1','joint2'].forEach(id=>{c.querySelector('#param_'+id).oninput=function(){c.querySelector('#val_'+id).textContent=this.value+'°';};});c.querySelector('#runSimBtn').onclick=function(){const j1=c.querySelector('#param_joint1').value,j2=c.querySelector('#param_joint2').value;s.textContent='计算中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 关节1='+j1+'°, 关节2='+j2+'°, 末端位置已计算</div>';l.scrollTop=l.scrollHeight;toast('✅ 计算完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='运动学计算就绪';c.querySelector('#param_joint1').value=45;c.querySelector('#val_joint1').textContent='45°';c.querySelector('#param_joint2').value=90;c.querySelector('#val_joint2').textContent='90°';l.innerHTML='📊 运动学计算工具就绪...';toast('🔄 已重置');};},
            [{q:'正运动学解决的问题是？',opts:['角度→位置','位置→角度','速度→时间','力→加速度'],ans:0,emoji:'📐',hint:'正=角度算出位置'},{q:'逆运动学比正运动学？',opts:['更简单','更复杂','一样难','不需要'],ans:1,emoji:'🔄',hint:'逆=反算更复杂'},{q:'2自由度机械臂有几个关节？',opts:['1个','2个','3个','4个'],ans:1,emoji:'🔢',hint:'自由度=关节数'},{q:'工作空间是什么？',opts:['办公室','机械臂能到达的区域','电机功率','传感器范围'],ans:1,emoji:'🎯',hint:'工作空间=可达范围'},{q:'运动学计算需要什么数学？',opts:['加减法','三角函数+矩阵','只有乘法','微积分'],ans:1,emoji:'📐',hint:'运动学=三角函数+矩阵'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 正运动学=<strong>角度→位置</strong><br>✅ 逆运动学=<strong>位置→角度</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：步态规划！🚶</div></div>');
        registry['10-2']=mk('步态规划师','🚶','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🚶</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">双足行走是机器人领域<strong style="color:#1a2a6c;">最难的问题</strong>之一！<br>人形机器人的每一步都需要<strong>精确的步态规划</strong>——<br>重心转移、脚掌着地、平衡保持。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'⚖️',title:'ZMP稳定',desc:'零力矩点\n始终在脚掌内',color:'#4a90d9'},{icon:'📏',title:'步态参数',desc:'步长+步频+抬脚高度\n决定行走质量',color:'#e67e22'},{icon:'🔄',title:'动态平衡',desc:'实时调整\n防止摔倒',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🚶</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">步态规划就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">步长</div><input type="range" class="sim-slider" id="param_stepLen" min="10" max="50" value="30" style="width:120px;"><div class="sim-value" id="val_stepLen">30cm</div></div><div style="text-align:center;"><div class="sim-label">步频</div><input type="range" class="sim-slider" id="param_cadence" min="1" max="5" value="2" style="width:120px;"><div class="sim-value" id="val_cadence">2Hz</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始行走</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 步态规划系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_stepLen').oninput=function(){c.querySelector('#val_stepLen').textContent=this.value+'cm';};c.querySelector('#param_cadence').oninput=function(){c.querySelector('#val_cadence').textContent=this.value+'Hz';};c.querySelector('#runSimBtn').onclick=function(){const sl=c.querySelector('#param_stepLen').value,ca=c.querySelector('#param_cadence').value;s.textContent='行走中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 步长'+sl+'cm, 步频'+ca+'Hz, 稳定行走</div>';l.scrollTop=l.scrollHeight;toast('✅ 行走成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='步态规划就绪';c.querySelector('#param_stepLen').value=30;c.querySelector('#val_stepLen').textContent='30cm';c.querySelector('#param_cadence').value=2;c.querySelector('#val_cadence').textContent='2Hz';l.innerHTML='📊 步态规划系统就绪...';toast('🔄 已重置');};},
            [{q:'ZMP是什么意思？',opts:['Zero Moment Point','Zone Map Point','Zero Motion Path','Z轴映射'],ans:0,emoji:'⚖️',hint:'ZMP=零力矩点'},{q:'步长指的是什么？',opts:['走路速度','每一步的距离','脚的大小','腿的长度'],ans:1,emoji:'📏',hint:'步长=每步跨距'},{q:'步频的单位是什么？',opts:['米','秒','Hz(赫兹)','度'],ans:2,emoji:'⏱️',hint:'步频=每秒步数=Hz'},{q:'双足行走为什么难？',opts:['不需要平衡','需要动态平衡','很容易','不用控制'],ans:1,emoji:'⚖️',hint:'平衡=最大难点'},{q:'人形机器人步态规划的核心是？',opts:['速度最快','稳定不摔倒','步数最多','外观好看'],ans:1,emoji:'🎯',hint:'稳定=安全第一'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 步态规划=<strong>ZMP+步态参数+平衡控制</strong><br>✅ 双足行走=机器人领域<strong>顶级难题</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：手势识别！✋</div></div>');
        registry['10-3']=mk('手势识别工程师','✋','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">✋</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">挥挥手，机器人就懂了！<br><strong style="color:#1a2a6c;">手势识别</strong>让人与机器人的交互<strong>更自然</strong>。<br>摄像头捕捉手部→AI识别手势→机器人执行动作。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'✋',title:'手势检测',desc:'MediaPipe/OpenCV\n检测手部关键点',color:'#4a90d9'},{icon:'🧠',title:'分类识别',desc:'CNN/Transformer\n识别手势类别',color:'#9b59b6'},{icon:'🤖',title:'动作映射',desc:'手势→机器人动作\n挥手=打招呼',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">✋</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">手势识别待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">手势数</div><input type="range" class="sim-slider" id="param_gestures" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_gestures">5种</div></div><div style="text-align:center;"><div class="sim-label">准确率</div><input type="range" class="sim-slider" id="param_accuracy" min="50" max="99" value="85" style="width:120px;"><div class="sim-value" id="val_accuracy">85%</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 识别手势</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 手势识别系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_gestures').oninput=function(){c.querySelector('#val_gestures').textContent=this.value+'种';};c.querySelector('#param_accuracy').oninput=function(){c.querySelector('#val_accuracy').textContent=this.value+'%';};c.querySelector('#runSimBtn').onclick=function(){const g=c.querySelector('#param_gestures').value,a=c.querySelector('#param_accuracy').value;s.textContent='识别中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+g+'种手势, 准确率'+a+'%</div>';l.scrollTop=l.scrollHeight;toast('✅ 识别成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='手势识别待机';c.querySelector('#param_gestures').value=5;c.querySelector('#val_gestures').textContent='5种';c.querySelector('#param_accuracy').value=85;c.querySelector('#val_accuracy').textContent='85%';l.innerHTML='📊 手势识别系统就绪...';toast('🔄 已重置');};},
            [{q:'手势识别常用什么框架？',opts:['ROS','MediaPipe','Django','Flask'],ans:1,emoji:'✋',hint:'MediaPipe=Google手势框架'},{q:'手部关键点通常有几个？',opts:['5个','10个','21个','50个'],ans:2,emoji:'🔢',hint:'21个手部关键点'},{q:'准确率越高意味什么？',opts:['识别更准','识别更快','手势更多','更省电'],ans:0,emoji:'🎯',hint:'准确率=正确率'},{q:'手势识别后机器人做什么？',opts:['什么都不做','执行对应动作','关机','重启'],ans:1,emoji:'🤖',hint:'手势→动作映射'},{q:'手势识别的应用场景？',opts:['智能家居','VR/AR','机器人控制','以上都是'],ans:3,emoji:'✅',hint:'手势=无处不在'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 手势识别=<strong>检测+分类+映射</strong><br>✅ MediaPipe提供<strong>21个手部关键点</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：人形机器人表演！🎭</div></div>');
        registry['10-4']=mk('表演导演','🎭','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🎭</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">综合<strong style="color:#1a2a6c;">运动学+步态+手势识别</strong>——<br>导演一场<strong>人形机器人表演</strong>！<br>编排动作序列，配上音乐，上台演出！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📋',title:'动作编排',desc:'设计动作序列\n设置时长和顺序',color:'#4a90d9'},{icon:'🎵',title:'音效配合',desc:'动作与音乐\n节奏同步',color:'#e67e22'},{icon:'🎬',title:'演出执行',desc:'按编排自动\n完成整场表演',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🎭</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">表演系统就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">动作数</div><input type="range" class="sim-slider" id="param_moves" min="1" max="20" value="8" style="width:120px;"><div class="sim-value" id="val_moves">8个</div></div><div style="text-align:center;"><div class="sim-label">时长</div><input type="range" class="sim-slider" id="param_duration" min="10" max="120" value="60" style="width:120px;"><div class="sim-value" id="val_duration">60秒</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始表演</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 表演编排系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_moves').oninput=function(){c.querySelector('#val_moves').textContent=this.value+'个';};c.querySelector('#param_duration').oninput=function(){c.querySelector('#val_duration').textContent=this.value+'秒';};c.querySelector('#runSimBtn').onclick=function(){const m=c.querySelector('#param_moves').value,d=c.querySelector('#param_duration').value;s.textContent='表演中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+m+'个动作, 时长'+d+'秒, 表演完成！🎭</div>';l.scrollTop=l.scrollHeight;toast('🎭 表演完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='表演系统就绪';c.querySelector('#param_moves').value=8;c.querySelector('#val_moves').textContent='8个';c.querySelector('#param_duration').value=60;c.querySelector('#val_duration').textContent='60秒';l.innerHTML='📊 表演编排系统就绪...';toast('🔄 已重置');};},
            [{q:'机器人表演编排需要什么？',opts:['只有动作','动作+时长+顺序','只有音乐','只有灯光'],ans:1,emoji:'📋',hint:'编排=动作+时间+顺序'},{q:'动作数越多表演越？',opts:['简单','复杂丰富','快速','省电'],ans:1,emoji:'🎭',hint:'动作多=表演丰富'},{q:'表演时长指的是？',opts:['每个动作时间','总表演时间','编程时间','休息时间'],ans:1,emoji:'⏱️',hint:'时长=总时间'},{q:'表演中最重要的能力是？',opts:['速度','动作精准+节奏感','高度','重量'],ans:1,emoji:'🎯',hint:'表演=精准+节奏'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 机器人表演=<strong>动作编排+节奏同步</strong><br>✅ 综合运用运动学+步态+识别</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R10课程完成！下一课程：无人机！✈️</div></div>');
    })();

    // R11: 无人机与空中机器人（13+岁）— 4课×5页
    (function(){
        const C='无人机与空中机器人';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['11-1']=mk('飞行原理师','🚁','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🚁</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">四旋翼无人机靠<strong style="color:#1a2a6c;">四个螺旋桨</strong>飞行！<br>调整各桨转速→控制<strong>升降、偏航、俯仰、横滚</strong>。<br>理解飞行动力学=安全飞行的基础！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'⬆️',title:'升力',desc:'螺旋桨产生\n向上的推力',color:'#4a90d9'},{icon:'🔄',title:'扭矩',desc:'桨旋转的反作用\n需要抵消',color:'#e67e22'},{icon:'⚖️',title:'平衡',desc:'四个桨协调\n保持稳定',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🚁</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">仿真就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">油门</div><input type="range" class="sim-slider" id="param_throttle" min="0" max="100" value="50" style="width:120px;"><div class="sim-value" id="val_throttle">50%</div></div><div style="text-align:center;"><div class="sim-label">偏航角</div><input type="range" class="sim-slider" id="param_yaw" min="-180" max="180" value="0" style="width:120px;"><div class="sim-value" id="val_yaw">0°</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 起飞</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 飞行仿真就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_throttle').oninput=function(){c.querySelector('#val_throttle').textContent=this.value+'%';};c.querySelector('#param_yaw').oninput=function(){c.querySelector('#val_yaw').textContent=this.value+'°';};c.querySelector('#runSimBtn').onclick=function(){const t=c.querySelector('#param_throttle').value,y=c.querySelector('#param_yaw').value;s.textContent='飞行中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 油门'+t+'%, 偏航'+y+'°, 稳定悬停</div>';l.scrollTop=l.scrollHeight;toast('✅ 悬停成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='仿真就绪';c.querySelector('#param_throttle').value=50;c.querySelector('#val_throttle').textContent='50%';c.querySelector('#param_yaw').value=0;c.querySelector('#val_yaw').textContent='0°';l.innerHTML='📊 飞行仿真就绪...';toast('🔄 已重置');};},
            [{q:'四旋翼有几个螺旋桨？',opts:['2个','4个','6个','8个'],ans:1,emoji:'🚁',hint:'四=4个桨'},{q:'油门控制什么？',opts:['方向','升降(高度)','拍照','通信'],ans:1,emoji:'⬆️',hint:'油门=升力=高度'},{q:'偏航(Yaw)是什么运动？',opts:['前进后退','左右旋转','上升下降','侧移'],ans:1,emoji:'🔄',hint:'偏航=绕Z轴旋转'},{q:'四个桨为什么不朝同方向转？',opts:['好看','抵消扭矩','省电','更快'],ans:1,emoji:'⚖️',hint:'抵消扭矩=不转圈'},{q:'悬停需要什么条件？',opts:['升力=重力','升力>重力','升力<重力','不需要平衡'],ans:0,emoji:'🎯',hint:'悬停=力平衡'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 四旋翼=<strong>4桨+飞控+平衡</strong><br>✅ 悬停=升力=重力+扭矩抵消</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：飞控编程！🐍</div></div>');
        registry['11-2']=mk('飞控编程师','🐍','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🐍✈️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">用<strong style="color:#1a2a6c;">Python</strong>代码控制无人机飞行！<br>设定高度、速度、航线——<br>让无人机<strong>自动完成飞行任务</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📡',title:'飞控通信',desc:'MAVLink协议\n地面站←→无人机',color:'#4a90d9'},{icon:'🐍',title:'Python API',desc:'DroneKit/pymavlink\n编程控制',color:'#e67e22'},{icon:'🗺️',title:'航线规划',desc:'设定航点\n自动飞行',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🐍</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">飞控就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">高度</div><input type="range" class="sim-slider" id="param_alt" min="1" max="50" value="10" style="width:120px;"><div class="sim-value" id="val_alt">10m</div></div><div style="text-align:center;"><div class="sim-label">速度</div><input type="range" class="sim-slider" id="param_speed" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_speed">5m/s</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 执行航线</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 飞控系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_alt').oninput=function(){c.querySelector('#val_alt').textContent=this.value+'m';};c.querySelector('#param_speed').oninput=function(){c.querySelector('#val_speed').textContent=this.value+'m/s';};c.querySelector('#runSimBtn').onclick=function(){const a=c.querySelector('#param_alt').value,sp=c.querySelector('#param_speed').value;s.textContent='飞行中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 高度'+a+'m, 速度'+sp+'m/s, 航线正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 飞行完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='飞控就绪';c.querySelector('#param_alt').value=10;c.querySelector('#val_alt').textContent='10m';c.querySelector('#param_speed').value=5;c.querySelector('#val_speed').textContent='5m/s';l.innerHTML='📊 飞控系统就绪...';toast('🔄 已重置');};},
            [{q:'无人机飞控常用什么协议？',opts:['HTTP','MAVLink','Bluetooth','WiFi'],ans:1,emoji:'📡',hint:'MAVLink=无人机通信协议'},{q:'Python控制无人机用什么库？',opts:['numpy','DroneKit','flask','pandas'],ans:1,emoji:'🐍',hint:'DroneKit=Python飞控库'},{q:'航点(waypoint)是什么？',opts:['起飞点','预设飞行路径点','降落点','充电点'],ans:1,emoji:'🗺️',hint:'航点=飞行路径点'},{q:'飞行高度受什么限制？',opts:['法律+安全','电池','通信','以上都是'],ans:3,emoji:'⚠️',hint:'多重因素限制'},{q:'自动航线的好处是？',opts:['更安全','可重复','精准','以上都是'],ans:3,emoji:'✅',hint:'自动化=安全+精准+可重复'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 飞控编程=<strong>MAVLink+Python+航线</strong><br>✅ 自动飞行=安全+精准+高效</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：AI航拍分析！📸</div></div>');
        registry['11-3']=mk('AI航拍分析师','📸','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">📸</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">无人机飞上天，不只为了拍照——<br><strong style="color:#1a2a6c;">AI实时分析</strong>航拍画面！<br>检测车辆、行人、建筑——<strong>空中智能监控</strong>。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📷',title:'航拍采集',desc:'高空视角\n广角拍摄',color:'#4a90d9'},{icon:'🧠',title:'AI分析',desc:'目标检测+分类\n实时处理',color:'#9b59b6'},{icon:'📊',title:'数据报告',desc:'生成分析结果\n统计+标注',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">📸</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">航拍待机</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">检测目标</div><input type="range" class="sim-slider" id="param_objects" min="1" max="10" value="3" style="width:120px;"><div class="sim-value" id="val_objects">3类</div></div><div style="text-align:center;"><div class="sim-label">航拍高度</div><input type="range" class="sim-slider" id="param_altitude" min="5" max="100" value="30" style="width:120px;"><div class="sim-value" id="val_altitude">30m</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 航拍分析</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 AI航拍系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_objects').oninput=function(){c.querySelector('#val_objects').textContent=this.value+'类';};c.querySelector('#param_altitude').oninput=function(){c.querySelector('#val_altitude').textContent=this.value+'m';};c.querySelector('#runSimBtn').onclick=function(){const o=c.querySelector('#param_objects').value,a=c.querySelector('#param_altitude').value;s.textContent='航拍分析中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 高度'+a+'m, 检测'+o+'类目标</div>';l.scrollTop=l.scrollHeight;toast('✅ 分析完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='航拍待机';c.querySelector('#param_objects').value=3;c.querySelector('#val_objects').textContent='3类';c.querySelector('#param_altitude').value=30;c.querySelector('#val_altitude').textContent='30m';l.innerHTML='📊 AI航拍系统就绪...';toast('🔄 已重置');};},
            [{q:'航拍分析的核心技术是？',opts:['GPS','AI视觉','蓝牙','WiFi'],ans:1,emoji:'🧠',hint:'AI视觉=航拍分析核心'},{q:'飞行高度越高拍摄范围？',opts:['越小','越大','不变','无法拍摄'],ans:1,emoji:'📷',hint:'高度高=视野广'},{q:'航拍能检测什么？',opts:['只有人','只有车','人+车+建筑等','不能检测'],ans:2,emoji:'🔍',hint:'AI可检测多类目标'},{q:'检测类别越多需要什么？',opts:['更强的模型','更少的电','更低的高度','更小的相机'],ans:0,emoji:'💪',hint:'多类=强模型'},{q:'航拍AI的应用包括？',opts:['农业监测','城市管理','搜救','以上都是'],ans:3,emoji:'✅',hint:'航拍AI=多领域应用'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 航拍AI=<strong>高空拍摄+实时分析</strong><br>✅ 飞行高度影响<strong>视野范围和细节</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：空中搜救任务！🆘</div></div>');
        registry['11-4']=mk('搜救任务指挥官','🆘','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🆘</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">综合<strong style="color:#1a2a6c;">飞行控制+AI航拍</strong>——<br>执行<strong>空中搜救任务</strong>！<br>自主搜索大面积区域，找到并定位目标。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🗺️',title:'区域规划',desc:'设定搜索区域\n划分网格',color:'#4a90d9'},{icon:'🔍',title:'自主搜索',desc:'按航线飞行\nAI检测目标',color:'#e74c3c'},{icon:'📍',title:'定位报告',desc:'发现目标→\n标记坐标→上报',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🆘</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">搜救就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">搜索面积</div><input type="range" class="sim-slider" id="param_area" min="100" max="10000" value="1000" style="width:120px;"><div class="sim-value" id="val_area">1000m²</div></div><div style="text-align:center;"><div class="sim-label">目标数</div><input type="range" class="sim-slider" id="param_targets" min="1" max="5" value="2" style="width:120px;"><div class="sim-value" id="val_targets">2个</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始搜救</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 搜救系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_area').oninput=function(){c.querySelector('#val_area').textContent=this.value+'m²';};c.querySelector('#param_targets').oninput=function(){c.querySelector('#val_targets').textContent=this.value+'个';};c.querySelector('#runSimBtn').onclick=function(){const a=c.querySelector('#param_area').value,t=c.querySelector('#param_targets').value;s.textContent='搜索中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 面积'+a+'m², 发现'+t+'个目标, 搜救完成！🆘</div>';l.scrollTop=l.scrollHeight;toast('🆘 搜救完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='搜救就绪';c.querySelector('#param_area').value=1000;c.querySelector('#val_area').textContent='1000m²';c.querySelector('#param_targets').value=2;c.querySelector('#val_targets').textContent='2个';l.innerHTML='📊 搜救系统就绪...';toast('🔄 已重置');};},
            [{q:'搜救无人机的首要任务是？',opts:['拍照','自主搜索+定位目标','送快递','表演'],ans:1,emoji:'🔍',hint:'搜救=找到目标'},{q:'搜索面积越大需要什么？',opts:['更小的无人机','更长的续航','更低的飞行高度','更少的电池'],ans:1,emoji:'🔋',hint:'大面积=长续航'},{q:'发现目标后应做什么？',opts:['继续飞','标记坐标+上报','忽略','降落'],ans:1,emoji:'📍',hint:'发现=定位+报告'},{q:'搜救无人机的优势是？',opts:['覆盖范围大','速度快','空中视角好','以上都是'],ans:3,emoji:'✅',hint:'无人机=多方面优势'},{q:'网格搜索策略的好处是？',opts:['不遗漏','速度快','省电','好看'],ans:0,emoji:'🗺️',hint:'网格=全面覆盖'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 搜救=<strong>区域规划+自主搜索+定位报告</strong><br>✅ 网格搜索=高效+全面覆盖</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎊 R11课程完成！最后一课：竞赛特训！🎯</div></div>');
    })();

    // R12: AI机器人竞赛特训（13+岁）— 4课×5页
    (function(){
        const C='AI机器人竞赛特训';
        function mk(lt,ii,ih,kh,lh,li,qb,sh,nh){return ()=>createMultiPageSim({courseTitle:C,lessonTopic:lt,introIcon:ii,introHTML:ih,knowledgeHTML:kh,labHTML:lh,labInit:li,quizBank:qb,summaryHTML:sh,nextHTML:nh});}
        registry['12-1']=mk('竞赛设计师','📐','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">📐</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">竞赛级机器人需要<strong style="color:#1a2a6c;">专业设计</strong>！<br>在重量、尺寸、性能等<strong>规则限制</strong>下——<br>设计出<strong>最优方案</strong>。</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📏',title:'规则约束',desc:'重量/尺寸/功率\n严格遵守竞赛规则',color:'#e74c3c'},{icon:'⚡',title:'性能优化',desc:'在约束下\n最大化性能',color:'#4a90d9'},{icon:'✅',title:'方案合规',desc:'设计符合规范\n通过技术检查',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">📐</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">设计就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">重量限制</div><input type="range" class="sim-slider" id="param_weight" min="500" max="5000" value="2000" style="width:120px;"><div class="sim-value" id="val_weight">2000g</div></div><div style="text-align:center;"><div class="sim-label">尺寸</div><input type="range" class="sim-slider" id="param_size" min="10" max="50" value="25" style="width:120px;"><div class="sim-value" id="val_size">25cm</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 设计验证</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 竞赛设计工具就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_weight').oninput=function(){c.querySelector('#val_weight').textContent=this.value+'g';};c.querySelector('#param_size').oninput=function(){c.querySelector('#val_size').textContent=this.value+'cm';};c.querySelector('#runSimBtn').onclick=function(){const w=c.querySelector('#param_weight').value,sz=c.querySelector('#param_size').value;s.textContent='设计中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 重量'+w+'g, 尺寸'+sz+'cm, 方案合规</div>';l.scrollTop=l.scrollHeight;toast('✅ 方案合规！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='设计就绪';c.querySelector('#param_weight').value=2000;c.querySelector('#val_weight').textContent='2000g';c.querySelector('#param_size').value=25;c.querySelector('#val_size').textContent='25cm';l.innerHTML='📊 竞赛设计工具就绪...';toast('🔄 已重置');};},
            [{q:'竞赛设计最重要的约束是？',opts:['颜色','重量+尺寸','品牌','价格'],ans:1,emoji:'📏',hint:'规则=重量+尺寸限制'},{q:'方案合规检查的目的是？',opts:['浪费时间','确保符合竞赛规则','收钱','好看'],ans:1,emoji:'✅',hint:'合规=通过技术检查'},{q:'在约束下优化性能叫？',opts:['突破规则','约束优化','无视规则','随意设计'],ans:1,emoji:'⚡',hint:'约束优化=规则内最优'},{q:'竞赛设计首要考虑什么？',opts:['外观','规则要求','价格','颜色'],ans:1,emoji:'📋',hint:'先理解规则再设计'},{q:'好的竞赛方案需要？',opts:['只考虑性能','规则+性能+可靠','只考虑价格','只考虑外观'],ans:1,emoji:'🎯',hint:'综合平衡各方面'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 竞赛设计=<strong>规则理解+约束优化</strong><br>✅ 合规=通过技术检查的门票</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：路径规划算法！🗺️</div></div>');
        registry['12-2']=mk('路径规划算法师','🗺️','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🗺️</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">竞赛中机器人要快速找到<strong style="color:#1a2a6c;">最优路径</strong>！<br><strong>A*算法</strong>和<strong>Dijkstra算法</strong>是经典路径规划方法。<br>选择正确的算法=更快完成任务！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'⭐',title:'A*算法',desc:'启发式搜索\n有方向性地找最优路径',color:'#4a90d9'},{icon:'🔢',title:'Dijkstra',desc:'广度优先\n保证最短路径',color:'#e67e22'},{icon:'📊',title:'网格地图',desc:'将地图离散化\n网格×网格',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🗺️</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">算法就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">算法</div><input type="range" class="sim-slider" id="param_algo" min="1" max="2" value="1" style="width:120px;"><div class="sim-value" id="val_algo">A*</div></div><div style="text-align:center;"><div class="sim-label">网格大小</div><input type="range" class="sim-slider" id="param_gridSize" min="5" max="20" value="10" style="width:120px;"><div class="sim-value" id="val_gridSize">10</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 规划路径</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 路径规划算法就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_algo').oninput=function(){c.querySelector('#val_algo').textContent=this.value==='1'?'A*':'Dijkstra';};c.querySelector('#param_gridSize').oninput=function(){c.querySelector('#val_gridSize').textContent=this.value;};c.querySelector('#runSimBtn').onclick=function(){const a=c.querySelector('#param_algo').value==='1'?'A*':'Dijkstra',g=c.querySelector('#param_gridSize').value;s.textContent='规划中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ 算法'+a+', 网格'+g+'x'+g+', 路径最优</div>';l.scrollTop=l.scrollHeight;toast('✅ 路径最优！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='算法就绪';c.querySelector('#param_algo').value=1;c.querySelector('#val_algo').textContent='A*';c.querySelector('#param_gridSize').value=10;c.querySelector('#val_gridSize').textContent='10';l.innerHTML='📊 路径规划算法就绪...';toast('🔄 已重置');};},
            [{q:'A*算法相比Dijkstra的优势是？',opts:['更慢','有方向性更快','更简单','不需要地图'],ans:1,emoji:'⭐',hint:'A*=启发式=更快'},{q:'Dijkstra算法的特点是？',opts:['不保证最优','保证最短路径','最快','随机'],ans:1,emoji:'🔢',hint:'Dijkstra=保证最优'},{q:'网格越大搜索？',opts:['越快','越慢但越精细','不变','不能计算'],ans:1,emoji:'📊',hint:'大网格=精细=慢'},{q:'路径规划的目标是？',ops:['最长的路径','最短/最优路径','随机路径','环形路径'],ans:1,emoji:'🎯',hint:'规划=最优路径'},{q:'实际竞赛选什么算法？',opts:['总是A*','总是Dijkstra','看情况选择','不用算法'],ans:2,emoji:'🤔',hint:'具体场景具体选'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ A*=<strong>启发式快速搜索</strong><br>✅ Dijkstra=<strong>保证最优路径</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">下一课：多机协同！🤝</div></div>');
        registry['12-3']=mk('多机协同工程师','🤝','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🤝</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">多台机器人<strong style="color:#1a2a6c;">协同工作</strong>比单打独斗更强大！<br><strong>群体智能</strong>——蚂蚁搬家、大雁南飞的启示。<br>协同通信+任务分配=高效团队！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'📡',title:'通信协议',desc:'机器人间\n消息传递协议',color:'#4a90d9'},{icon:'📋',title:'任务分配',desc:'合理分工\n避免冲突',color:'#e67e22'},{icon:'🐜',title:'群体智能',desc:'协作涌现\n1+1>2',color:'#5cb85c'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🤝</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">协同系统就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">机器人数量</div><input type="range" class="sim-slider" id="param_robots" min="2" max="10" value="3" style="width:120px;"><div class="sim-value" id="val_robots">3台</div></div><div style="text-align:center;"><div class="sim-label">通信协议</div><input type="range" class="sim-slider" id="param_protocol" min="1" max="3" value="1" style="width:120px;"><div class="sim-value" id="val_protocol">1</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 启动协同</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 多机协同系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_robots').oninput=function(){c.querySelector('#val_robots').textContent=this.value+'台';};c.querySelector('#param_protocol').oninput=function(){c.querySelector('#val_protocol').textContent=this.value;};c.querySelector('#runSimBtn').onclick=function(){const r=c.querySelector('#param_robots').value,p=c.querySelector('#param_protocol').value;s.textContent='协同中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+r+'台机器人, 协议'+p+', 协同正常</div>';l.scrollTop=l.scrollHeight;toast('✅ 协同成功！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='协同系统就绪';c.querySelector('#param_robots').value=3;c.querySelector('#val_robots').textContent='3台';c.querySelector('#param_protocol').value=1;c.querySelector('#val_protocol').textContent='1';l.innerHTML='📊 多机协同系统就绪...';toast('🔄 已重置');};},
            [{q:'多机协同的核心挑战是？',opts:['通信+协调','只有速度','只有电量','只有外观'],ans:0,emoji:'📡',hint:'协同=通信+协调'},{q:'群体智能的典型例子是？',opts:['单人工作','蚂蚁搬家','独狼','孤岛'],ans:1,emoji:'🐜',hint:'蚂蚁=群体智能'},{q:'通信协议的作用是？',opts:['省电','机器间交换信息','加速','变好看'],ans:1,emoji:'📡',hint:'协议=通信规则'},{q:'机器人越多协调越？',opts:['简单','复杂','不变','不重要'],ans:1,emoji:'🤝',hint:'数量多=协调难'},{q:'多机协同的优势是？',opts:['分工合作','效率更高','容错性强','以上都是'],ans:3,emoji:'✅',hint:'协同=多方面优势'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 多机协同=<strong>通信+协调+分工</strong><br>✅ 群体智能=1+1>2</div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:14px;font-weight:700;color:#1a2a6c;">最后一课：模拟竞赛实战！🏆</div></div>');
        registry['12-4']=mk('竞赛冠军','🏆','<div style="text-align:center;margin:16px 0;"><span style="font-size:72px;">🏆</span></div><div style="background:linear-gradient(135deg,#e8f0fe,#f8f6f0);border-radius:16px;padding:16px;margin:12px 0;border:2px solid #e8e0d5;"><p style="font-size:14px;color:#4a3a2a;line-height:1.8;text-align:center;margin:0;">12门课程的学习成果——<strong style="color:#1a2a6c;">终极竞赛模拟</strong>！<br>综合运用所有技能，在<strong>限时内完成所有任务</strong>。<br>检验你的<strong>AI机器人综合能力</strong>！</p></div>',
            '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:12px 0;">'+[{icon:'🧠',title:'综合技能',desc:'编程+机械+AI\n全部用上',color:'#9b59b6'},{icon:'⏱️',title:'时间压力',desc:'限时完成任务\n分秒必争',color:'#e74c3c'},{icon:'🏆',title:'冠军之路',desc:'沉着冷静\n发挥最佳水平',color:'#f1c40f'}].map(c=>'<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;border:3px solid #e8e0d5;flex:1;min-width:100px;"><div style="font-size:32px;">'+c.icon+'</div><div style="font-size:13px;font-weight:800;color:#1a2a6c;">'+c.title+'</div><div style="font-size:10px;color:#7a6a5a;white-space:pre-line;">'+c.desc+'</div></div>').join('')+'</div>',
            '<div style="text-align:center;margin-bottom:14px;"><div style="display:inline-block;padding:16px 32px;background:#f0ede4;border-radius:16px;"><div style="font-size:48px;">🏆</div><div style="font-size:14px;font-weight:600;color:#4a3a2a;margin-top:6px;" id="simStatus">竞赛就绪</div></div></div><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:10px;"><div style="text-align:center;"><div class="sim-label">任务数</div><input type="range" class="sim-slider" id="param_tasks" min="1" max="10" value="5" style="width:120px;"><div class="sim-value" id="val_tasks">5个</div></div><div style="text-align:center;"><div class="sim-label">限时</div><input type="range" class="sim-slider" id="param_time" min="60" max="600" value="300" style="width:120px;"><div class="sim-value" id="val_time">300秒</div></div></div><div class="sim-controls" style="justify-content:center;"><button class="sim-btn sim-btn-success" id="runSimBtn">▶️ 开始竞赛</button><button class="sim-btn sim-btn-warning" id="resetSimBtn">🔄 重置</button></div><div id="simLog" style="margin-top:12px;padding:8px 12px;background:#1e1e2e;color:#cdd6f4;border-radius:10px;font-family:monospace;font-size:12px;max-height:80px;overflow-y:auto;">📊 竞赛系统就绪...</div>',
            function(c){const s=c.querySelector('#simStatus'),l=c.querySelector('#simLog');c.querySelector('#param_tasks').oninput=function(){c.querySelector('#val_tasks').textContent=this.value+'个';};c.querySelector('#param_time').oninput=function(){c.querySelector('#val_time').textContent=this.value+'秒';};c.querySelector('#runSimBtn').onclick=function(){const t=c.querySelector('#param_tasks').value,ti=c.querySelector('#param_time').value;s.textContent='竞赛中...';l.innerHTML+='<div>⏱ '+(new Date().toLocaleTimeString())+' → ✅ '+t+'个任务, 限时'+ti+'秒, 竞赛完成！🏆</div>';l.scrollTop=l.scrollHeight;toast('🏆 竞赛完成！');};c.querySelector('#resetSimBtn').onclick=function(){s.textContent='竞赛就绪';c.querySelector('#param_tasks').value=5;c.querySelector('#val_tasks').textContent='5个';c.querySelector('#param_time').value=300;c.querySelector('#val_time').textContent='300秒';l.innerHTML='📊 竞赛系统就绪...';toast('🔄 已重置');};},
            [{q:'竞赛中最重要的素质是？',opts:['速度','综合能力+冷静','只关注自己','忽略对手'],ans:1,emoji:'🧠',hint:'综合+心态=冠军'},{q:'时间压力下应该？',opts:['慌乱','冷静分配时间','放弃','哭泣'],ans:1,emoji:'⏱️',hint:'冷静=时间管理'},{q:'任务数越多需要什么？',opts:['更快的速度','更好的策略','更稳定的发挥','以上都是'],ans:3,emoji:'📋',hint:'多任务=综合考验'},{q:'竞赛中遇到失败应该？',opts:['放弃','分析原因继续','怪机器人','找借口'],ans:1,emoji:'💪',hint:'失败=学习机会'},{q:'整个课程体系的核心是？',opts:['只有编程','AI+机器人+实践','只有理论','只有机械'],ans:1,emoji:'🎓',hint:'AI机器人=综合实践'}],
            '<div style="background:#fff;border-radius:16px;padding:16px;border:2px solid #e8e0d5;"><div style="font-size:15px;font-weight:700;color:#1a2a6c;text-align:center;">📝 学到了</div><div style="font-size:13px;color:#4a3a2a;line-height:2;">✅ 竞赛=<strong>技能+策略+心理</strong>的综合考验<br>✅ 12门课程=<strong>完整的AI机器人知识体系</strong></div></div>',
            '<div style="background:linear-gradient(135deg,#e8f0fe,#f0ede4);border-radius:16px;padding:14px;text-align:center;border:2px solid #e8e0d5;margin-top:12px;"><div style="font-size:28px;margin-bottom:4px;">🎊</div><div style="font-size:14px;font-weight:700;color:#1a2a6c;">🎓 恭喜！你已完成全部12门AI机器人课程！</div><div style="font-size:13px;color:#4a3a2a;">从机器人初探到竞赛实战——你已经是一名<strong>AI机器人工程师</strong>了！</div></div>');
    })();

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
