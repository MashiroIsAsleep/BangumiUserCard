/// <reference types="mdast" />
import { h } from 'hastscript'

/**
 * Creates a Bangumi Card component.
 *
 * @param {Object} properties - The properties for the component.
 * @param {string} properties.user - The Bangumi user ID or username.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Bangumi Card component.
 */
export function BangumiCardComponent(properties, children) {
  // Ensure leaf directive (no children allowed)
  if (Array.isArray(children) && children.length !== 0) {
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("bangumi" must be a leaf type "::bangumi{user="username"}")',
    ])
  }

  // Validate user property
  if (!properties.user) {
    return h(
      'div',
      { class: 'hidden' },
      'Invalid user. ("user" attribute must be provided for a Bangumi card")',
    )
  }

  const user = properties.user
  const cardUuid = `BC${Math.random().toString(36).slice(-6)}`

  // Create placeholders
  const nAvatar = h(`div#${cardUuid}-avatar`, { class: 'bc-avatar' })
  const nNickname = h(
    `div#${cardUuid}-nickname`,
    { class: 'bc-nickname' },
    'Loading…',
  )
  const nUsername = h(
    `span#${cardUuid}-username`,
    { class: 'bc-username' },
    `@${user}`,
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

  // Create the card element
  const cardEl = h(
    `a#${cardUuid}-card`,
    {
      class: 'card-bangumi fetch-waiting no-styling',
      href: `https://bangumi.tv/user/${user}`,
      target: '_blank',
      rel: 'noopener noreferrer',
      'data-user': user,
      'data-card-uuid': cardUuid,
    },
    [
      // Left Side: Avatar and User Details
      h('div', { class: 'bc-user-card' }, [
        nAvatar,
        h('div', { class: 'bc-user-details' }, [
          // Combine Nickname and Username
          h('div', { class: 'bc-name-container' }, [nNickname, nUsername]),
          // Bio below
          nSign,
        ]),
      ]),
      // Right Side: User Group and User ID
      h('div', { class: 'bc-additional-info' }, [nUserGroup, nUserId]),
    ],
  )

  // Inject the script that runs in the browser
  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
      (function() {
        console.log("[BANGUMI-CARD] Script executing for user: ${user}");
        fetch('https://api.bgm.tv/v0/users/${user}')
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
    `,
  )

  // Append the script to the card element
  cardEl.children.push(nScript)

  return cardEl
}
