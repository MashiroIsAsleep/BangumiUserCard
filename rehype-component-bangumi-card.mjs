/// <reference types="mdast" />
import { h } from 'hastscript'

/**
 * BangumiCardComponent
 * 
 * This component generates a Bangumi user card based on the provided properties.
 * It fetches user data from the Bangumi API and dynamically updates the card with
 * the user's information such as avatar, nickname, username, signature, user groups, and ID.
 * 
 * @param {Object} properties - The properties object containing attributes for the component.
 * @param {Array} children - The child nodes passed to the component.
 * @returns {Object} - A virtual DOM node representing the Bangumi user card.
 */
export function BangumiCardComponent(properties, children) {
  if (Array.isArray(children) && children.length !== 0) {
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("bangumi" must be a leaf type "::bangumi{user="username"}")',
    ])
  }
  if (!properties.user) {
    return h(
      'div',
      { class: 'hidden' },
      'Invalid user. ("user" attribute must be provided for a Bangumi card")',
    )
  }
  const user = properties.user
  const cardUuid = `BC${Math.random().toString(36).slice(-6)}`
  const nAvatar = h(`div#${cardUuid}-avatar`, { class: 'bc-avatar' })
  const nNicknameLine = h(
    `div#${cardUuid}-nickname-line`,
    { class: 'bc-nickname-line' },
    [
      h(`div#${cardUuid}-nickname`, { class: 'bc-nickname' }, 'Loading…'),
      h(`span#${cardUuid}-username`, { class: 'bc-username' }, `@${user}`),
    ],
  )
  const nSign = h(`div#${cardUuid}-sign`, { class: 'bc-sign' }, 'Loading…')
  const nUserGroup = h(
    `div#${cardUuid}-usergroup`,
    { class: 'bc-usergroup' },
    'Loading…',
  )
  const nUserId = h(
    `div#${cardUuid}-userid`,
    { class: 'bc-userid' },
    'Loading…',
  )
  const cardEl = h(
    `a#${cardUuid}-card`,
    {
      class: 'card-bangumi fetch-waiting no-styling',
      href: `https://bangumi.tv/user/${user}`,
      target: '_blank',
      'data-user': user,
      'data-card-uuid': cardUuid,
      style: 'text-decoration: none; color: inherit;',
    },
    [
      h('div', { class: 'bc-user-card' }, [
        nAvatar,
        h('div', { class: 'bc-user-details' }, [nNicknameLine, nSign]),
      ]),
      h('div', { class: 'bc-additional-info' }, [nUserGroup, nUserId]),
    ],
  )
  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
    (function() {
      console.log("[BANGUMI-CARD] Script executing for user: ${user}");
      fetch('https://api.bgm.tv/v0/users/${user}', {
        headers: {
          'User-Agent': 'MashiroIsAsleep/BangumiUserCard (https://github.com/MashiroIsAsleep/BangumiUserCard)'
        }
      })
      .then(function(response) {
        if (!response.ok) throw new Error(response.status + " " + response.statusText);
        return response.json();
      })
      .then(function(data) {
        console.log("[BANGUMI-CARD] Data fetched:", data);
        var avatarUrl = data.avatar && (data.avatar.large || data.avatar.medium || data.avatar.small);
        if (avatarUrl) {
          var avatarEl = document.getElementById('${cardUuid}-avatar');
          if (avatarEl) {
            avatarEl.style.backgroundImage = 'url(' + avatarUrl + ')';
            avatarEl.style.backgroundColor = 'transparent';
          }
        }
        var nickname = data.nickname || '${user}';
        var nicknameEl = document.getElementById('${cardUuid}-nickname');
        if (nicknameEl) {
          nicknameEl.innerText = nickname;
        }
        var usernameEl = document.getElementById('${cardUuid}-username');
        if (usernameEl) {
          usernameEl.innerText = '@' + data.username;
        }
        var sign = data.sign || "No signature available";
        var signEl = document.getElementById('${cardUuid}-sign');
        if (signEl) {
          signEl.innerText = sign;
        }
        var userGroup = data.user_group || "N/A";
        var userGroupEl = document.getElementById('${cardUuid}-usergroup');
        if (userGroupEl) {
          userGroupEl.innerText = "Groups attended: " + userGroup;
        }
        var userId = data.id || "N/A";
        var userIdEl = document.getElementById('${cardUuid}-userid');
        if (userIdEl) {
          userIdEl.innerText = "ID: " + userId;
        }
        var cardEl = document.getElementById('${cardUuid}-card');
        if (cardEl) {
          cardEl.classList.remove('fetch-waiting');
        }
        console.log("[BANGUMI-CARD] Loaded card for ${user} | ${cardUuid}.");
      })
      .catch(function(err) {
        console.error("[BANGUMI-CARD] (Error) Loading card for ${user}:", err);
        var cardEl = document.getElementById('${cardUuid}-card');
        if (cardEl) {
          cardEl.classList.add('fetch-error');
        }
        var nicknameEl = document.getElementById('${cardUuid}-nickname');
        if (nicknameEl) {
          nicknameEl.innerText = "Error loading user";
        }
        var signEl = document.getElementById('${cardUuid}-sign');
        if (signEl) {
          signEl.innerText = "";
        }
        var userGroupEl = document.getElementById('${cardUuid}-usergroup');
        if (userGroupEl) {
          userGroupEl.innerText = "";
        }
        var userIdEl = document.getElementById('${cardUuid}-userid');
        if (userIdEl) {
          userIdEl.innerText = "";
        }
      });
    })();
    `
  )
  cardEl.children.push(nScript)
  return cardEl
}