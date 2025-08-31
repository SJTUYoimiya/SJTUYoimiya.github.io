---
title: Ubuntu 下的 Docker Engine 安装与 NVIDIA Container Toolkit 配置
date: 2024-11-06T11:30:24+08:00
tags: ["Ubuntu", "Docker"]
draft: false
layout: "article"
categories: "tech"
isCJSLanguage: true
---

在本文中，我们将在 Ubuntu Server 中安装 Docker Engine 并配置成 rootless 模式，同时配置 NVIDIA Container Toolkit 以支持 GPU 加速.

> Docker Engine 轻量级且无需图形界面，运行高效稳定；与 Linux 内核深度集成，性能更高，资源占用更少，且提供了强大的 CLI 和 API 支持，易用性更强，且更适合作为服务器端使用. 因此即便在 Desktop 环境中，人们更倾向于安装 Docker Engine 而非 Docker Desktop.

## 安装 Docker Engine

本节由 [Docker 官方文档](https://docs.docker.com/engine/install/ubuntu/) 翻译而来，适用于 Ubuntu 系统.

在开始安装前，请确保您的系统[满足先决条件](#准备步骤)，随后执行[以下步骤](#通过-apt-安装-docker-engine)安装 Docker Engine.

### 准备步骤

#### 防火墙限制

> ⚠️ 警告: 在安装 Docker 之前，请务必考虑以下安全问题和防火墙不兼容问题.
>
> - 如果您使用 **ufw** 或 **firewalld** 管理防火墙设置，请注意当您使用 Docker 暴露容器端口时，这些端口会绕过您的防火墙规则。有关详细信息，请参阅 [Docker and ufw](https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw);
> - Docker 只与 `iptables-nft` 和 `iptables-legacy` 兼容，安装了 Docker 的系统不支持使用 `nft` 创建的防火墙规则. 请确保使用 `iptables` 或 `ip6tables` 创建了防火墙规则集，并将它们添加到 `DOCKER-USER` 链中. 请参阅 [Packet filtering and firewalls](https://docs.docker.com/engine/network/packet-filtering-firewalls/);

#### 系统要求

要安装 Docker Engine，你需要这些 Ubuntu 版本中的一个 64 位版本:

- Ubuntu Oracular 24.10
- Ubuntu Noble 24.04 (LTS)
- Ubuntu Jammy 22.04 (LTS)
- Ubuntu Focal 20.04 (LTS)

适用于 Ubuntu 的 Docker Engine 与 x86_64（或 amd64）、armhf、arm64、s390x 和 ppc64le (ppc64el) 体系结构兼容.

> Docker 官方不支持在 Ubuntu 衍生发行版（如 Linux Mint）上安装，尽管这是可能实现的.

#### 卸载旧版本

有的 Linux 发行版可能会提供非官方的 Docker 软件包，这些软件包可能会与 Docker 提供的官方软件包冲突。在安装官方版本的 Docker Engine 之前，你必须卸载这些软件包. 需要卸载的非官方软件包有

- `docker.io`
- `docker-compose`
- `docker-compose-v2`
- `docker-doc`
- `podman-docker`

此外，Docker Engine 还依赖于 `containerd` 和 `runc`，Docker Engine 将这些依赖捆绑为一个捆绑包: `containerd.io`. 如果你以前安装过 `containerd` 或 `runc`，请卸载它们以避免与 Docker Engine 捆绑的版本冲突. 运行以下命令卸载所有冲突的软件包:

```shell
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

卸载 Docker 时，存储在 `/var/lib/docker/` 中的映像、容器、卷和网络不会自动移除。如果你想从一个干净的安装开始，并喜欢清理任何现有数据，请执行以下命令：

```shell
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

> ⚠️  注意：执行 `sudo rm -rf` 时，请务必检查执行路径，确保操作安全，避免误删系统文件.

### 通过 apt 安装 Docker Engine

在首次安装 Docker Engine 之前，需要先设置 Docker `apt` 仓库源. 之后，你就可以从版本库中安装和更新 Docker 了

#### 设置 apt 仓库源

1. 安装依赖工具

  ```shell
  sudo apt update
  sudo apt install ca-certificates curl
  ```

2. 信任 Docker 的 GPG 公钥

  ```shell
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  ```

3. 将 Docker 仓库添加到系统的 `apt` 源列表中

  ```shell
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt update
  ```

#### 安装 Docker Engine

执行以下指令安装 Docker Engine 及相关组件

```shell
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### 验证安装

安装完成后，可以通过 `docker version` / `docker --version` / `docker info` 检查安装信息.

### Docker 配置

#### Rootless 模式

> Docker daemon 绑定到一个 Unix socket 而非 TCP 端口. 默认情况下，Unix socket 的所有者是 `root` 用户，其他用户只能使用 `sudo` 访问该 socket. Docker daemon 始终以 `root` 用户身份运行. 如果不想在执行 `docker` 命令前加上 `sudo`，可以创建一个名为 `docker` 的 Unix 组，并将用户添加到该组中. 当 Docker daemon 启动时，它会创建一个 Unix socket 供 docker 组的成员访问. 在某些 Linux 发行版上，系统会在使用软件包管理器安装 Docker 引擎时自动创建该组. 在这种情况下，你无需手动创建该组.

> ⚠️ [!警告] docker 组会授予用户 root 级权限。有关这对系统安全性的影响，请参见 [Docker Daemon Attack Surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface).

首先创建一个 `docker` Unix 用户组，并将当前用户添加到组中

```shell
sudo groupadd docker
sudo usermod -aG docker $USER
```

注销并重新登录或者执行 `newgrp docker` 使命令配置生效，通过以下指令检查当前用户是否属于 `docker` 用户组

```shell
groups $USER
```

> **Debug. 权限问题**
>
> 如果在将用户添加到 `docker` 组之前，您使用 `sudo` 运行了 Docker CLI 命令，可能会遇到以下警告：
>
> ```shell
>WARNING: Error loading config file: /home/user/.docker/config.json - stat /home/user/.docker/config.json: permission denied
> ```
>
> 该错误表明，由于之前使用了 `sudo`，`~/.docker/` 目录的权限可能被更改，导致普通用户无权访问.
>
> **解决方法**：
>
> 删除 `~/.docker/` 目录（会自动重建，但会丢失自定义设置），或通过以下指令修复权限：
>
> ```shell
>sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
> sudo chmod g+rwx "$HOME/.d
> ```

##### 利用 `systemd` 控制 Docker 启动

在 Debian/Ubuntu 中，Docker 会默认开机自启动，或者你也可以手动配置开机自启与立即启动行为

```shell
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```

#### 为 Docker 设置代理

由于碰都不能碰的原因，我们需要为 root 用户与普通用户分别配置代理网络. 如果你使用路由器/旁路由上网，则可跳过此部分. 如何你在宿主机上使用了代理软件（如 V2Ray、Clash、Trojan-Go 等），则需要为 Docker 设置代理.

##### `root` 用户代理配置

在执行 `docker pull` 操作时，由 `systemd` 控制的守护进程 `dockerd` 负责处理。因此，需要在 `dockerd` 中配置代理.

1. 创建代理配置文件

  ```shell
  sudo mkdir -p /etc/systemd/system/docker.service.d
  sudo touch /etc/systemd/system/docker.service.d/proxy.conf
  ```

2. 在 `proxy.conf` （事实上，文件名可以设置为 `*.conf` ）中添加以下内容，其中代理地址与端口与代理软件中一致.

  ```shell
  [Service]
  Environment="HTTP_PROXY=http://127.0.0.1:7890/"
  Environment="HTTPS_PROXY=http://127.0.0.1:7890/"
  Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
  ```

3. 刷新 `systemd` 配置并重启 Docker 服务：

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart docker
  ```

#### user 代理配置

编辑 `~/.config/systemd/user/docker.service` 文件，添加以下内容：

```shell
[Service]
Environment="HTTP_PROXY=http://10.0.2.2:7890/"
Environment="HTTPS_PROXY=http://10.0.2.2:7890/"
Environment="NO_PROXY=localhost,127.0.0.1,.example.com"
```

刷新用户级别的代理配置并重启 Docker 服务

```shell
systemctl --user daemon-reload
systemctl --user restart docker
```

此时就可以正常从 Docker Hub 拉取镜像了

```shell
-> % docker run --rm hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
c1ec31eb5944: Pull complete
Digest: sha256:d211f485f2dd1dee407a80973c8f129f00d54604d2c90732e8e320e5038a0348
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

## 安装 NVIDIA Container Toolkit

NVIDIA Container Toolkit 允许你在 Docker 容器中使用 CUDA 加速，可以通过 `apt` 安装. 本节翻译自 [NVIDIA 官方教程](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

首先下载 NVIDIA 验证公钥

```shell
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
```

下载 NVIDIA 提供的 `apt` 源列表文件并将其添加到系统目录

```shell
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
```

更新系统包索引并安装 NVIDIA Container Toolkit

```shell
sudo apt update
sudo apt install -y nvidia-container-toolkit
```

### 验证安装

安装完成后，通过 `nvidia-container-cli info` 命令验证 NVIDIA Container Toolkit 是否安装成功，若成功，将看到类似输出：

```shell
-> % nvidia-container-cli info
NVRM version:   550.127.08
CUDA version:   12.4

Device Index:   0
Device Minor:   0
Model:          NVIDIA GeForce RTX 4070 Ti SUPER
Brand:          GeForce
...
```

### 在 Docker 中配置

利用 `nvidia-ctk` 命令设置 Docker

```shell
sudo nvidia-ctk runtime configure --runtime=docker
```

该指令会编辑 `/etc/docker/daemon.json` 文件使 Docker 可以调用 NVIDIA Container Runtime. 重启 Docker 守护进程使修改生效：

```shell
sudo systemctl restart docker
```

#### Rootless 模式下配置

为了在不使用 `sudo` 时也能调用 GPU，还需要在 Rootless 模式中配置，执行

```shell
nvidia-ctk runtime configure --runtime=docker --config=$HOME/.config/docker/daemon.json
```

重启用户守护进程使修改生效

```shell
systemctl --user restart docker
```

利用 `sudo nvidia-ctk` 指令编辑 `/etc/nvidia-container-runtime/config.toml`

```shell
sudo nvidia-ctk config --set nvidia-container-cli.no-cgroups --in-place
```

现在就可以通过添加 `--gpus=all` 参数在 Docker 中调用 NVIDIA GPU 了，可以在容器中使用 `nvidia-smi` 测试安装

```shell
% docker run --gpus=all -it ubuntu:jammy nvidia-smi
Thu Mar 13 09:20:36 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.144.03             Driver Version: 550.144.03     CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4070 ...    Off |   00000000:01:00.0 Off |                  N/A |
|  0%   39C    P8             17W /  295W |       4MiB /  16376MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```
