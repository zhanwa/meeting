这是会议实时互动的微信小程序端
Django后端代码请移步:(https://github.com/zhanwa/back.git)
vue搭建的后台管理系统请移步:(https://github.com/zhanwa/web-manage.git)

//状态码202,会使axios前端收不到数据.不要自己坑自己
## 功能描述
### 小程序端：
用户：</br>
报名参加相关会议，可在会议列表中查询已开始、进行中和已完成的会议详情，当会议开始时，可在相关页面进行相关的操作，比如：向大屏幕发送弹幕、扫二维码签到、参与答题、参与抽奖、记录笔记、下载预览文件等等。</br>
管理者：</br>
创建会议，管理会议，比如：审核大屏幕弹幕、管理签到方式、管理大屏幕显示内容、发起答题、发起抽奖等等功能。</br>
### WEB端：
管理页面：</br>
同小程序管理端，对大屏幕上展示内容进行控制、审核弹幕内容、上传文件等等。</br>
显示页面：</br>
专用于相关信息的展示，比如：显示弹幕、抽奖、实时展示答题结果等等功能。</br>

## 技术选型
小程序端：uniapp
WEB端：vue.js+elementui
后端：python + Django
数据库：Mysql

## 项目目录结构

### （一）小程序端目录结构 
#### wx + components(非自写组件)
├─pages //小程序主要页面存放</br>
│  ├─announce //会议公告页</br>
│  ├─appen //会议功能页</br>
│  ├─chart //聊天页面(包括好友和房间)</br>
│  ├─create_meeting //创建会议页</br>
│  ├─current_conference //当前会议页面</br>
│  ├─file //上传下载文件页面</br>
│  ├─feedback //用户反馈页</br>
│  ├─file //会议文件页面</br>
│  ├─home_page //好友页(未改名)</br>
│  ├─login//登录页</br>
│  ├─lottery //抽奖页</br>
│  ├─lottery_append //参与抽奖</br>
│  ├─meeting_detail //会议详情页</br>
│  ├─my_award //我的奖品页</br>
│  ├─my_meeting //我的会议页</br>
│  ├─qr_code //二维码页面</br>
│  ├─sign_in//签到页面</br>
│  ├─user_center //用户中心</br>
│  ├─vote_attend //参与投票页面</br>
│  └─vote_manage //投票管理页面</br>
