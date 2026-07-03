"use strict";
// ============================================================
//  AI机器人·成长营 — 用户认证系统
//  基于服务器端 API 的登录/注册/权限管理
//  支持管理员激活用户功能
// ============================================================

const Auth = (function() {
    'use strict';

    const API_URL = 'api/auth.php';
    const SESSION_KEY = 'airobot_session';

    // ---------- 会话管理（本地仅存会话信息） ----------
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

    function getSessionToken() {
        const session = getSession();
        if (!session) return '';
        return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
    }

    // ---------- API 请求 ----------
    function apiRequest(action, data) {
        const headers = { 'Content-Type': 'application/json' };
        const token = getSessionToken();
        if (token) {
            headers['X-Session'] = token;
        }
        return fetch(API_URL + '?action=' + action, {
            method: 'POST',
            headers: headers,
            body: data ? JSON.stringify(data) : undefined
        }).then(function(res) { return res.json(); });
    }

    function apiGet(action) {
        const headers = { 'Content-Type': 'application/json' };
        const token = getSessionToken();
        if (token) {
            headers['X-Session'] = token;
        }
        return fetch(API_URL + '?action=' + action, {
            method: 'GET',
            headers: headers
        }).then(function(res) { return res.json(); });
    }

    // ---------- 公开 API ----------
    return {
        /** 注册新用户（异步） */
        register: function(data) {
            return apiRequest('register', data);
        },

        /** 登录（异步） */
        login: function(username, password) {
            return apiRequest('login', {
                username: username,
                password: password
            }).then(function(result) {
                if (result.success && result.user) {
                    saveSession({
                        username: result.user.username,
                        nickname: result.user.nickname,
                        role: result.user.role,
                        loginTime: Date.now()
                    });
                }
                return result;
            });
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

        /** 获取所有用户列表（异步，仅管理员可用） */
        getAllUsers: function() {
            return apiGet('users');
        },

        /** 激活用户（异步，仅管理员可用） */
        activateUser: function(username) {
            return apiRequest('activate', { username: username });
        },

        /** 停用用户（异步，仅管理员可用） */
        deactivateUser: function(username) {
            return apiRequest('deactivate', { username: username });
        },

        /** 删除用户（异步，仅管理员可用） */
        deleteUser: function(username) {
            return apiRequest('delete', { username: username });
        }
    };
})();

// 兼容别名
const AuthManager = Auth;
