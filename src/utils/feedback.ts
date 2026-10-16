import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

let enabled = true;
const cache: Record<string, Audio.Sound | null> = {};

const SOURCES: Record<string, number> = {
  click: require('../../assets/sfx/click.wav'),
  success: require('../../assets/sfx/success.wav'),
  profit: require('../../assets/sfx/profit.wav'),
  loss: require('../../assets/sfx/loss.wav'),
};

export async function initAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch {
    /* ignore */
  }
}

async function play(key: keyof typeof SOURCES) {
  if (!enabled) return;
  try {
    let sound = cache[key];
    if (!sound) {
      const { sound: s } = await Audio.Sound.createAsync(SOURCES[key], { shouldPlay: false, volume: 0.7 });
      cache[key] = s;
      sound = s;
    }
    await sound?.replayAsync();
  } catch {
    /* offline / decode issues */
  }
}

export async function tapFeedback() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch { /* */ }
  play('click');
}

export async function successFeedback() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch { /* */ }
  play('success');
}

export async function profitFeedback() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch { /* */ }
  play('profit');
}

export async function lossFeedback() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch { /* */ }
  play('loss');
}

export async function heavyTap() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch { /* */ }
  play('click');
}
