'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Layout } from '@/components/layout/layout';
import { Card } from '@/components/ui/card';
import { settingsStyles } from '@/styles/components/settings';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleSwitchClasses = (isOn: boolean) => clsx(
    settingsStyles.toggle.switch.base,
    {
      [settingsStyles.toggle.switch.on]: isOn,
      [settingsStyles.toggle.switch.off]: !isOn,
    }
  );

  const thumbClasses = (isOn: boolean) => clsx(
    settingsStyles.toggle.switch.thumb,
    {
      [settingsStyles.toggle.switch.thumbOn]: isOn,
      [settingsStyles.toggle.switch.thumbOff]: !isOn,
    }
  );

  return (
    <Layout>
      <div className={settingsStyles.container}>
        <div className={settingsStyles.header.container}>
          <h1 className={settingsStyles.header.title}>ユーザー設定</h1>
          <p className={settingsStyles.header.description}>
            アカウント情報やアプリケーションの設定を管理できます
          </p>
        </div>

        <div className={settingsStyles.grid}>
          <Card className={settingsStyles.card}>
            <h2 className={settingsStyles.section.title}>プロフィール</h2>
            <div className={settingsStyles.section.content}>
              <div>
                <label className={settingsStyles.form.label}>
                  ユーザー名
                </label>
                <input
                  type="text"
                  className={settingsStyles.form.input}
                  placeholder="ユーザー名を入力"
                />
              </div>
              <div>
                <label className={settingsStyles.form.label}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  className={settingsStyles.form.input}
                  placeholder="メールアドレスを入力"
                />
              </div>
              <button className={settingsStyles.form.button}>
                保存
              </button>
            </div>
          </Card>

          <Card className={settingsStyles.card}>
            <h2 className={settingsStyles.section.title}>アプリケーション設定</h2>
            <div className={settingsStyles.section.content}>
              <div className={settingsStyles.toggle.container}>
                <div>
                  <h3 className={settingsStyles.toggle.title}>ダークモード</h3>
                  <p className={settingsStyles.toggle.description}>ダークテーマを使用する</p>
                </div>
                <button 
                  className={toggleSwitchClasses(darkMode)}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <div className={thumbClasses(darkMode)}></div>
                </button>
              </div>
              <div className={settingsStyles.toggle.container}>
                <div>
                  <h3 className={settingsStyles.toggle.title}>通知</h3>
                  <p className={settingsStyles.toggle.description}>プッシュ通知を受け取る</p>
                </div>
                <button 
                  className={toggleSwitchClasses(notifications)}
                  onClick={() => setNotifications(!notifications)}
                >
                  <div className={thumbClasses(notifications)}></div>
                </button>
              </div>
            </div>
          </Card>

          <Card className={settingsStyles.card}>
            <h2 className={settingsStyles.section.title}>アカウント管理</h2>
            <div className={settingsStyles.section.content}>
              <button className={settingsStyles.account.deleteButton}>
                アカウントを削除
              </button>
              <button className={settingsStyles.account.logoutButton}>
                ログアウト
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
