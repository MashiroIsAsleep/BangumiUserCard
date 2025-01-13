///<reference types='mdast' />
import { h } from 'hastscript'

/**
 * Creates a simplified Bangumi Card component (linking to a user profile).
 *
 * Fetches user information from Bangumi's API and displays:
 * - Avatar
 * - Nickname
 * - Username (@username)
 * - Bio (Sign)
 * - User Group (as a number)
 * - User ID
 *
 * @param {Object} properties - The properties for the component.
 * @param {string} properties.user - The Bangumi user ID or username.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Bangumi Card component.
 */
export function BangumiCardComponent(properties, children) {
  console.log('[BANGUMI-CARD] Rendering component for user:', properties.user)

  // Ensure leaf directive (no children allowed)
  if (Array.isArray(children) && children.length !== 0) {
    console.log('[BANGUMI-CARD] Invalid directive: children present.')
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("bangumi" must be a leaf type "::bangumi{user="username"}")',
    ])
  }

  // Validate user property
  if (!properties.user) {
    console.log("[BANGUMI-CARD] Invalid user: 'user' attribute missing.")
    return h(
      'div',
      { class: 'hidden' },
      'Invalid user. ("user" attribute must be provided for a Bangumi card")',
    )
  }

  const user = properties.user
  const cardUuid = `BC${Math.random().toString(36).slice(-6)}`

  // Elements to update dynamically once the fetch completes
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

  // Script to fetch data from the Bangumi API and update the DOM
  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
      document.addEventListener('DOMContentLoaded', function() {
        console.log("[BANGUMI-CARD] Script executing for user: ${user}");
        
        console.log("[BANGUMI-CARD] Initiating fetch for user: ${user}");
        fetch('https://api.bgm.tv/v0/users/${user}')
          .then(function(response) {
            console.log("[BANGUMI-CARD] Received response:", response);
            if (!response.ok) throw new Error(response.status + " " + response.statusText);
            return response.json();
          })
          .then(function(data) {
            console.log("[BANGUMI-CARD] Parsed data:", data);
            
            var avatarUrl = data.avatar && (data.avatar.large || data.avatar.medium || data.avatar.small);
            if (avatarUrl) {
              console.log("[BANGUMI-CARD] Updating avatar...");
              var avatarEl = document.getElementById('${cardUuid}-avatar');
              if (avatarEl) {
                avatarEl.style.backgroundImage = 'url(' + avatarUrl + ')';
                avatarEl.style.backgroundColor = 'transparent';
                console.log("[BANGUMI-CARD] Avatar updated successfully.");
              } else {
                console.error("[BANGUMI-CARD] Avatar element not found.");
              }
            } else {
              console.warn("[BANGUMI-CARD] Avatar URL not found in data.");
            }

            var nickname = data.nickname || '${user}';
            var nicknameEl = document.getElementById('${cardUuid}-nickname');
            if (nicknameEl) {
              nicknameEl.innerText = nickname;
              console.log("[BANGUMI-CARD] Nickname updated.");
            } else {
              console.error("[BANGUMI-CARD] Nickname element not found.");
            }

            var usernameEl = document.getElementById('${cardUuid}-username');
            if (usernameEl) {
              usernameEl.innerText = '@' + data.username;
              console.log("[BANGUMI-CARD] Username updated.");
            } else {
              console.error("[BANGUMI-CARD] Username element not found.");
            }

            var sign = data.sign || "No signature available";
            var signEl = document.getElementById('${cardUuid}-sign');
            if (signEl) {
              signEl.innerText = sign;
              console.log("[BANGUMI-CARD] Sign updated.");
            } else {
              console.error("[BANGUMI-CARD] Sign element not found.");
            }

            var userGroup = data.user_group || "N/A";
            var userGroupEl = document.getElementById('${cardUuid}-usergroup');
            if (userGroupEl) {
              userGroupEl.innerText = "Groups attended: " + userGroup;
              console.log("[BANGUMI-CARD] User group updated.");
            } else {
              console.error("[BANGUMI-CARD] User group element not found.");
            }

            var userId = data.id || "N/A";
            var userIdEl = document.getElementById('${cardUuid}-userid');
            if (userIdEl) {
              userIdEl.innerText = "ID: " + userId;
              console.log("[BANGUMI-CARD] User ID updated.");
            } else {
              console.error("[BANGUMI-CARD] User ID element not found.");
            }

            var cardEl = document.getElementById('${cardUuid}-card');
            if (cardEl) {
              cardEl.classList.remove('fetch-waiting');
              console.log("[BANGUMI-CARD] Removed 'fetch-waiting' class.");
            } else {
              console.error("[BANGUMI-CARD] Card element not found.");
            }

            console.log("[BANGUMI-CARD] Loaded card for ${user} | ${cardUuid}.");
          })
          .catch(function(err) {
            console.error("[BANGUMI-CARD] (Error) Loading card for ${user}:", err);
            var cardEl = document.getElementById('${cardUuid}-card');
            if (cardEl) {
              cardEl.classList.add('fetch-error');
              console.log("[BANGUMI-CARD] Added 'fetch-error' class.");
            } else {
              console.error("[BANGUMI-CARD] Card element not found for error handling.");
            }
            var nicknameEl = document.getElementById('${cardUuid}-nickname');
            if (nicknameEl) {
              nicknameEl.innerText = "Error loading user";
              console.log("[BANGUMI-CARD] Updated nickname to indicate error.");
            }
            var signEl = document.getElementById('${cardUuid}-sign');
            if (signEl) {
              signEl.innerText = "";
              console.log("[BANGUMI-CARD] Cleared sign.");
            }
            var userGroupEl = document.getElementById('${cardUuid}-usergroup');
            if (userGroupEl) {
              userGroupEl.innerText = "";
              console.log("[BANGUMI-CARD] Cleared user group.");
            }
            var userIdEl = document.getElementById('${cardUuid}-userid');
            if (userIdEl) {
              userIdEl.innerText = "";
              console.log("[BANGUMI-CARD] Cleared user ID.");
            }
          });
      });
    `,
  )

  // Return the anchor that wraps the placeholders + script
  return h(
    `a#${cardUuid}-card`,
    {
      class: 'card-bangumi fetch-waiting no-styling',
      href: `https://bangumi.tv/user/${user}`,
      target: '_blank',
      rel: 'noopener noreferrer',
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
      // Script to fetch and populate data
      nScript,
    ],
  )
}
