import sample from 'lodash.sample';

export function getSuccessEmoji() {
  return sample([
    '👍',
    '🙌',
    '🤘',
    '💪',
    '💯',
    '❤️',
    '🔥',
    '✨',
    '🌟',
    '🍻',
    '😀',
    '😁',
    '😎',
    '🙆',
    '🙆‍♂️'
  ]);
}

export function getFailureEmoji() {
  return sample([
    '👎',
    '💔',
    '⛈',
    '💀',
    '💩',
    '😑',
    '😞',
    '😤',
    '😫',
    '😭',
    '😵',
    '🤷‍♀️',
    '🤷‍♂️',
    '🤦‍♀️',
    '🤦‍♂️',
    '🙅',
    '🙅‍♂️'
  ]);
}
