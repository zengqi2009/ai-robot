"use strict";
// ============================================================
//  AI机器人·成长营 — 用户认证系统
//  基于 localStorage 的简易登录/注册/权限管理
//  支持管理员激活用户功能
// ============================================================

const Auth = (function() {
    'use strict';

    const STORAGE_KEY = 'airobot_users';
    const SESSION_KEY = 'airobot_session';
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

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

    // ---------- 初始化管理员账户 ----------
    function initAdmin() {
        const users = getUsers();
        if (!users[ADMIN_USERNAME]) {
            users[ADMIN_USERNAME] = {
                password: ADMIN_PASSWORD,
                nickname: '管理员',
                role: 'admin',
                active: true,
                createdAt: Date.now(),
                lastLogin: null
            };
            saveUsers(users);
        }
    }
    initAdmin();

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
                role: 'user',
                active: false,
                createdAt: Date.now(),
                lastLogin: null
            };
            saveUsers(users);
            return { success: true, message: '注册成功，请等待管理员激活' };
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
            // 检查激活状态（管理员自动激活）
            if (user.role !== 'admin' && !user.active) {
                return { success: false, message: '账号待激活，请联系管理员' };
            }
            user.lastLogin = Date.now();
            saveUsers(users);
            saveSession({
                username: username,
                nickname: user.nickname,
                role: user.role || 'user',
                loginTime: Date.now()
            });
            return { success: true, message: '登录成功', nickname: user.nickname, role: user.role };
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
        },

        /** 检查当前用户是否为管理员 */
        isAdmin: function() {
            const session = getSession();
            return session && session.role === 'admin';
        },

        /** 获取所有用户列表（仅管理员可用） */
        getAllUsers: function() {
            if (!this.isAdmin()) {
                return { success: false, message: '无权限' };
            }
            const users = getUsers();
            const userList = Object.keys(users).map(username => ({
                username: username,
                nickname: users[username].nickname,
                role: users[username].role || 'user',
                active: users[username].active || false,
                createdAt: users[username].createdAt,
                lastLogin: users[username].lastLogin
            }));
            return { success: true, users: userList };
        },

        /** 激活用户（仅管理员可用） */
        activateUser: function(username) {
            if (!this.isAdmin()) {
                return { success: false, message: '无权限' };
            }
            const users = getUsers();
            if (!users[username]) {
                return { success: false, message: '用户不存在' };
            }
            users[username].active = true;
            saveUsers(users);
            return { success: true, message: '用户已激活' };
        },

        /** 停用用户（仅管理员可用） */
        deactivateUser: function(username) {
            if (!this.isAdmin()) {
                return { success: false, message: '无权限' };
            }
            const users = getUsers();
            if (!users[username]) {
                return { success: false, message: '用户不存在' };
            }
            if (users[username].role === 'admin') {
                return { success: false, message: '不能停用管理员账户' };
            }
            users[username].active = false;
            saveUsers(users);
            return { success: true, message: '用户已停用' };
        },

        /** 删除用户（仅管理员可用） */
        deleteUser: function(username) {
            if (!this.isAdmin()) {
                return { success: false, message: '无权限' };
            }
            const users = getUsers();
            if (!users[username]) {
                return { success: false, message: '用户不存在' };
            }
            if (users[username].role === 'admin') {
                return { success: false, message: '不能删除管理员账户' };
            }
            delete users[username];
            saveUsers(users);
            return { success: true, message: '用户已删除' };
        }
    };
})();

// 兼容别名
const AuthManager = Auth;
