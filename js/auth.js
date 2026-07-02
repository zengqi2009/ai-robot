"use strict";
// ============================================================
//  AI机器人·成长营 — 用户认证系统
//  基于 localStorage 的简易登录/注册/权限管理
// ============================================================

const Auth = (function() {
    'use strict';

    const STORAGE_KEY = 'airobot_users';
    const SESSION_KEY = 'airobot_session';

    // ---------- 用户数据 ----------
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch(e) {
            return {};
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    // ---------- 会话管理 ----------
    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY));
        } catch(e) {
            return null;
        }
    }

    function saveSession(session) {
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    }

    // ---------- 公开 API ----------
    return {
        /** 注册新用户 */
        register: function(username, password, nickname) {
            username = username.trim().toLowerCase();
            if (!username || !password) {
                return { success: false, message: '用户名和密码不能为空' };
            }
            if (username.length < 2) {
                return { success: false, message: '用户名至少2个字符' };
            }
            if (password.length < 4) {
                return { success: false, message: '密码至少4个字符' };
            }
            const users = getUsers();
            if (users[username]) {
                return { success: false, message: '用户名已存在' };
            }
            users[username] = {
                password: password,
                nickname: nickname || username,
                createdAt: Date.now(),
                lastLogin: null
            };
            saveUsers(users);
            return { success: true, message: '注册成功' };
        },

        /** 登录 */
        login: function(username, password) {
            username = username.trim().toLowerCase();
            const users = getUsers();
            const user = users[username];
            if (!user) {
                return { success: false, message: '用户名或密码错误' };
            }
            if (user.password !== password) {
                return { success: false, message: '用户名或密码错误' };
            }
            user.lastLogin = Date.now();
            saveUsers(users);
            saveSession({
                username: username,
                nickname: user.nickname,
                loginTime: Date.now()
            });
            return { success: true, message: '登录成功', nickname: user.nickname };
        },

        /** 退出登录 */
        logout: function() {
            saveSession(null);
        },

        /** 获取当前登录用户信息 */
        currentUser: function() {
            return getSession();
        },

        /** 是否已登录 */
        isLoggedIn: function() {
            return getSession() !== null;
        },

        /** 获取当前用户昵称 */
        getNickname: function() {
            const session = getSession();
            return session ? session.nickname : '访客';
        },

        /** 获取当前用户完整信息 */
        getCurrentUser: function() {
            return getSession();
        }
    };
})();

// 兼容别名
const AuthManager = Auth;
