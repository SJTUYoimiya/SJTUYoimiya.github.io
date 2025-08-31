---
title: SSH 服务器配置
date: 2024-09-03T10:00:32+08:00
tags: ["Ubuntu", "Mac"]
draft: false
layout: "article"
categories: "tech"
isCJSLanguage: true
---

SSH 作为最常用的远程登录、连接协议，在远程服务器上配置 SSH Server 当然是必不可少的。本文将记录作者在 Ubuntu & macOS 上配置 SSH Server 的过程。

## 服务器端安装与配置

### 安装 SSH Server

在 Ubuntu 上执行

```shell
sudo apt update -y && sudo apt install openssh-server -y
```

更新 `apt` 源并安装 SSH Server。

在 macOS 上 SSH Server 默认已经安装，只要在**设置>通用>共享>远程登录**中打开即可。

### 服务器端配置

编辑 SSH Server 的配置文件 `/etc/ssh/sshd_config`，修改以下项以提高安全性

```
PermitRootLogin no
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

修改完成后保存并退出，启动 SSH Server 并设置开机自启（macOS 上不需要）

```shell
sudo systemctl start sshd
sudo systemctl enable sshd
```

可以通过 `systemctl status sshd` 查看 SSH Server 的运行状态

```shell
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2025-03-24 13:48:48 CST; 3 days ago
       Docs: man:sshd(8)
             man:sshd_config(5)
   Main PID: 8703 (sshd)
      Tasks: 1 (limit: 38020)
     Memory: 7.3M
        CPU: 3.038s
     CGroup: /system.slice/ssh.service
             └─8703 "sshd: /usr/sbin/sshd -D [listener] 0 of 50-100 startups"
```

### 客户端配置

在客户端，我们可以通过密码或 SSH 密钥连接到 SSH Server. 为了提高安全性，同时避免每次重复输入密码，我们推荐使用 SSH 密钥连接.

1. 首先检查本地的 SSH 密钥. 执行 `ls ~/.ssh`，检查本地是否有 `id_rsa`, `id_ed25519` 等密钥文件

  若本地不存在密钥文件，可以通过 `ssh-keygen -t ed25519` 生成新的 ed25519 加密的密钥对. 过程中会提示输入保存路径和认证短语，直接回车即可

  ```shell
  Generating public/private ed25519 key pair.
  Enter file in which to save the key (/home/user/.ssh/id_ed25519): 
  Enter passphrase for "/home/user/.ssh/id_ed25519" (empty for no passphrase): 
  Enter same passphrase again: 
  Your identification has been saved in i
  Your public key has been saved in i.pub
  The key fingerprint is:
  SHA256:
  The key's randomart image is:
  +--[ED25519 256]--+
  |                 |
  |                 |
  |                 |
  |                 |
  |                 |
  |                 |
  |                 |
  |                 |
  |                 |
  +----[SHA256]-----+
  ```

2. 将公钥添加到服务器的 `~/.ssh/authorized_keys` 中，执行

  ```shell
  ssh-copy-id -i ~/.ssh/<your-key> username@server-ip
  ```

  按照提示完成认证，此时将可以通过密钥连接到 SSH 服务器. 

3. 在客户端保存密钥信息，以便 SSH Client 可以加载配置文件. 向 `~/.ssh/config` 添加以下内容

  ```
  Host <friendly-name>
    HostName <server-ip>
    User <user-name>
    Port <port default 22>
    AddKeyToAgent yes
    IdentityFile <path/to/your/private-key>
  ```

现在就可以通过密钥认证连接到 SSH Server

```shell
ssh <friendly-name>
```

#### 禁用密码登录

为了提高安全性，在配置好密钥后，可以禁用密码登录 SSH. 编辑配置文件 `/etc/ssh/sshd_config` ，将 `PasswordAuthentication` 修改为 `no` ，重启 SSH 服务以应用更改：

```shell
sudo systemctl restart sshd
```

<i class="fa-regular fa-sparkles"></i> **Tips**:

在 Ubuntu Server 中，连接到 SSH 时系统会加载 `/etc/update-motd.d` 下的脚本，用于显示系统信息，类似如下内容

```shell
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 5.15.0-134-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.
Last login:
```

要屏蔽这些消息只需要为 `/etc/update-motd.d` 去除执行权限
```shell
sudo chmod -x /etc/update-motd.d/*
```
