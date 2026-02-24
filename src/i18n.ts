import * as vscode from 'vscode';

export interface I18nStrings {
    extension_active: string;
    hello_world: string;
    waiting_command: string;
    status_prefix: string;
    action_ready: string;
    terminal_detected: string;
    save: string;
    shop: string;
    train: string;
    heal: string;
    craft: string;
    boss_battle: string;
    success: string;
}

const en: I18nStrings = {
    extension_active: 'Congratulations, your extension "pixelquest-vscode-extension" is now active!',
    hello_world: 'Hello World from PixelQuest!',
    waiting_command: 'Waiting for command...',
    status_prefix: 'Status',
    action_ready: 'Ready!',
    terminal_detected: 'Detected RPG Action: {0} from data: {1}',
    save: 'SAVE',
    shop: 'SHOP',
    train: 'TRAIN',
    heal: 'HEAL',
    craft: 'CRAFT',
    boss_battle: 'BOSS BATTLE',
    success: 'SUCCESS'
};

const zhTW: I18nStrings = {
    extension_active: '恭喜，您的擴充功能 "pixelquest-vscode-extension" 現已啟用！',
    hello_world: '來自 PixelQuest 的問候！',
    waiting_command: '等待指令中...',
    status_prefix: '狀態',
    action_ready: '就緒！',
    terminal_detected: '偵測到 RPG 動作：{0}，來源數據：{1}',
    save: '存檔 (SAVE)',
    shop: '商店 (SHOP)',
    train: '訓練 (TRAIN)',
    heal: '治療 (HEAL)',
    craft: '鍛造 (CRAFT)',
    boss_battle: 'BOSS 戰戰鬥 (BOSS BATTLE)',
    success: '成功 (SUCCESS)'
};

export function getStrings(): I18nStrings {
    const config = vscode.workspace.getConfiguration('pixelquest');
    const language = config.get<string>('language') || vscode.env.language;

    if (language.startsWith('zh')) {
        return zhTW;
    }
    return en;
}

export function format(str: string, ...args: any[]): string {
    return str.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
}