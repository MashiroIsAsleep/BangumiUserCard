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
  // Validate that the component does not have any children.
  if (Array.isArray(children) && children.length !== 0) {
    // If children are present, return a hidden div with an error message.
    return h('div', { class: 'hidden' }, [
      'Invalid directive. ("bangumi" must be a leaf type "::bangumi{user="username"}")',
    ])
  }

  // Ensure that the 'user' property is provided.
  if (!properties.user) {
    // If 'user' is missing, return a hidden div with an error message.
    return h(
      'div',
      { class: 'hidden' },
      'Invalid user. ("user" attribute must be provided for a Bangumi card")',
    )
  }

  // Extract the 'user' attribute from properties.
  const user = properties.user
  // Generate a unique identifier for the card to avoid ID conflicts.
  const cardUuid = `BC${Math.random().toString(36).slice(-6)}`

  /**
   * Create Virtual DOM Elements for the Card
   */

  // Avatar container
  const nAvatar = h(`div#${cardUuid}-avatar`, { class: 'bc-avatar' })

  // Nickname line containing the nickname and username
  const nNicknameLine = h(
    `div#${cardUuid}-nickname-line`,
    { class: 'bc-nickname-line' },
    [
      // Nickname element (initially shows 'Loading…')
      h(`div#${cardUuid}-nickname`, { class: 'bc-nickname' }, 'Loading…'),
      // Username element prefixed with '@' (initially shows '@username')
      h(`span#${cardUuid}-username`, { class: 'bc-username' }, `@${user}`),
    ],
  )

  // Signature element (initially shows 'Loading…')
  const nSign = h(`div#${cardUuid}-sign`, { class: 'bc-sign' }, 'Loading…')

  // User group information (initially shows 'Loading…')
  const nUserGroup = h(
    `div#${cardUuid}-usergroup`,
    { class: 'bc-usergroup' },
    'Loading…',
  )

  // User ID information (initially shows 'Loading…')
  const nUserId = h(
    `div#${cardUuid}-userid`,
    { class: 'bc-userid' },
    'Loading…',
  )

  // Main card element linking to the user's Bangumi profile
  const cardEl = h(
    `a#${cardUuid}-card`,
    {
      class: 'card-bangumi fetch-waiting no-styling',
      href: `https://bangumi.tv/user/${user}`,
      target: '_blank', // Opens link in a new tab
      'data-user': user,
      'data-card-uuid': cardUuid,
      style: 'text-decoration: none; color: inherit;', // Inline styles to remove default link styling
    },
    [
      // User card section containing avatar and user details
      h('div', { class: 'bc-user-card' }, [
        nAvatar,
        h('div', { class: 'bc-user-details' }, [nNicknameLine, nSign]),
      ]),
      // Additional information section containing user groups and ID
      h('div', { class: 'bc-additional-info' }, [nUserGroup, nUserId]),
    ],
  )

  /**
   * Embed a Script to Fetch and Populate User Data
   * 
   * The script fetches user data from the Bangumi API and updates the card elements
   * with the retrieved information. It also handles error states by updating the card
   * with appropriate messages and styles.
   */
  const nScript = h(
    `script#${cardUuid}-script`,
    { type: 'text/javascript', defer: true },
    `
      (function() {
        console.log("[BANGUMI-CARD] Script executing for user: ${user}");
        
        fetch('https://api.bgm.tv/v0/users/${user}')
          .then(function(response) {
            if (!response.ok) throw new Error(response.status + " " + response.statusText);
            return response.json(); // Parse JSON data
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

  // Append the script element to the card's children to ensure it executes
  cardEl.children.push(nScript)

  // Return the fully constructed card element
  return cardEl
}
