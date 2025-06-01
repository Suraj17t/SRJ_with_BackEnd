
document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded");
  
    // Sidebar
    const menuItems = document.querySelectorAll('.menu-item');
    const messagesNotification = document.querySelector('#messages-notifications');
    const messages = document.querySelector('.messages');
    const message = messages ? messages.querySelectorAll('.message') : [];
    const messageSearch = document.querySelector('#message-search');
  
    // Remove active class from all menu items
    const changeActiveItem = () => {
        menuItems.forEach(item => item.classList.remove('active'));
    };
  
    // Sign Out function
    function signOut() {
        window.location.href = "/login"; // update path if different
    }
  
    const signoutBtn = document.getElementById("signout-button");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", signOut);
    }
  
    // Notification popup logic
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            changeActiveItem();
            item.classList.add('active');
  
            if (item.id !== 'notifications') {
                document.querySelector('.notifications-popup').style.display = 'none';
            } else {
                document.querySelector('.notifications-popup').style.display = 'block';
                const count = document.querySelector('#notifications .notification-count');
                if (count) count.style.display = 'none';
            }
        });
    });
  
    // Hide notification popup on body click
    document.body.addEventListener('click', event => {
        if (!event.target.closest('.notifications-popup') && !event.target.closest('#notifications')) {
            document.querySelector('.notifications-popup').style.display = 'none';
        }
    });
  
    // Message search logic
    const searchMessage = () => {
        const val = messageSearch.value.toLowerCase();
        message.forEach(chat => {
            let name = chat.querySelector('h5').textContent.toLowerCase();
            chat.style.display = name.includes(val) ? 'flex' : 'none';
        });
    };
  
    if (messageSearch) {
        messageSearch.addEventListener('keyup', searchMessage);
    }
  
    if (messagesNotification && messages) {
        messagesNotification.addEventListener('click', () => {
            messages.style.boxShadow = '0 0 1rem var(--color-primary)';
            const count = messagesNotification.querySelector('.notification-count');
            if (count) count.style.display = 'none';
            setTimeout(() => messages.style.boxShadow = 'none', 2000);
        });
    }
  
    // Theme customization
    const theme = document.querySelector('#theme');
    const themeModal = document.querySelector('.customize-theme');
    const fontSizes = document.querySelectorAll('.choose-size span');
    const root = document.querySelector(':root');
    const colorPalette = document.querySelectorAll('.choose-color span');
    const Bg1 = document.querySelector('.bg-1');
    const Bg2 = document.querySelector('.bg-2');
    const Bg3 = document.querySelector('.bg-3');
    const themeLinks = document.querySelectorAll('.theme-link');
  
    const openThemeModal = () => themeModal.style.display = 'grid';
    const closeThemeModal = e => {
        if (e.target.classList.contains('customize-theme')) {
            themeModal.style.display = 'none';
        }
    };
  
    if (theme && themeModal) {
        theme.addEventListener('click', openThemeModal);
        themeModal.addEventListener('click', closeThemeModal);
    }
  
    const removeSizeSelector = () => {
        fontSizes.forEach(size => size.classList.remove('active'));
    };
  
    fontSizes.forEach(size => {
        size.addEventListener('click', () => {
            removeSizeSelector();
            size.classList.add('active');
            let fontSize;
  
            if (size.classList.contains('font-size-1')) {
                fontSize = '10px';
                root.style.setProperty('--sticky-top-left', '5.4rem');
                root.style.setProperty('--sticky-top-right', '5.4rem');
            } else if (size.classList.contains('font-size-2')) {
                fontSize = '13px';
                root.style.setProperty('--sticky-top-left', '5.4rem');
                root.style.setProperty('--sticky-top-right', '-7rem');
            } else if (size.classList.contains('font-size-3')) {
                fontSize = '16px';
                root.style.setProperty('--sticky-top-left', '-2rem');
                root.style.setProperty('--sticky-top-right', '-17rem');
            } else if (size.classList.contains('font-size-4')) {
                fontSize = '19px';
                root.style.setProperty('--sticky-top-left', '-5rem');
                root.style.setProperty('--sticky-top-right', '-25rem');
            } else if (size.classList.contains('font-size-5')) {
                fontSize = '22px';
                root.style.setProperty('--sticky-top-left', '-12rem');
                root.style.setProperty('--sticky-top-right', '-35rem');
            }
  
            document.querySelector('html').style.fontSize = fontSize;
        });
    });
  
    const changeActiveColorClass = () => {
        colorPalette.forEach(colorPicker => colorPicker.classList.remove('active'));
    };
  
    colorPalette.forEach(color => {
        color.addEventListener('click', () => {
            let primaryHue;
            changeActiveColorClass();
            color.classList.add('active');
  
            if (color.classList.contains('color-1')) {
                primaryHue = 252;
            } else if (color.classList.contains('color-2')) {
                primaryHue = 52;
            } else if (color.classList.contains('color-3')) {
                primaryHue = 352;
            } else if (color.classList.contains('color-4')) {
                primaryHue = 152;
            } else if (color.classList.contains('color-5')) {
                primaryHue = 202;
            }
  
            root.style.setProperty('--primary-color-hue', primaryHue);
        });
    });
  
    // Background Theme Logic
    let lightColorLightness, whiteColorLightness, darkColorLightness;
  
    const changeBG = () => {
        root.style.setProperty('--light-color-lightness', lightColorLightness);
        root.style.setProperty('--white-color-lightness', whiteColorLightness);
        root.style.setProperty('--dark-color-lightness', darkColorLightness);
  
        if (darkColorLightness === '95%') {
            themeLinks.forEach(link => link.style.color = 'gold');
        } else {
            themeLinks.forEach(link => link.style.color = 'blue');
        }
    };
  
    Bg1?.addEventListener('click', () => {
        darkColorLightness = null;
        whiteColorLightness = null;
        lightColorLightness = null;
        changeBG();
        Bg1.classList.add('active');
        Bg2.classList.remove('active');
        Bg3.classList.remove('active');
    });
  
    Bg2?.addEventListener('click', () => {
        darkColorLightness = '95%';
        whiteColorLightness = '20%';
        lightColorLightness = '15%';
        changeBG();
        Bg2.classList.add('active');
        Bg1.classList.remove('active');
        Bg3.classList.remove('active');
    });
  
    Bg3?.addEventListener('click', () => {
        darkColorLightness = '95%';
        whiteColorLightness = '10%';
        lightColorLightness = '0%';
        changeBG();
        Bg3.classList.add('active');
        Bg1.classList.remove('active');
        Bg2.classList.remove('active');
    });
  });



// WORKING ======= Increasing Like  ==============================================================

// // Formatter for likes
// function formatLikes(n) {
//   n = Number(n); 
//   if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
//   if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
//   return n;
// }

// // Format all like counts on initial page load
// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll('.lc').forEach(span => {
//     const raw = parseInt(span.textContent, 10);
//     span.textContent = formatLikes(raw);
//   });
// });

// function toggleLike(icon, postId) {
//     const liked = icon.classList.contains('liked');
//     const newLikedState = !liked;
  
//     fetch(`/posts/${postId}/like`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ like: newLikedState })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           const likeCountSpan = document.getElementById(`likeCount-${postId}`);
//           // likeCountSpan.textContent = data.newLikeCount;
//           likeCountSpan.textContent = formatLikes(Number(data.newLikeCount)); // 🔥 🟢 Live formatting here
  
//           // Just toggle the class and color — don't remove the icon
//           icon.classList.toggle('liked', newLikedState);
//           icon.style.color = newLikedState ? 'red' : 'black';
//         }
//       })
//       .catch(err => console.error('Like error:', err));
//   }

function toggleLike(icon, postId) {
  const liked = icon.classList.contains('liked');
  const newLikedState = !liked;

  fetch(`/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ like: newLikedState })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const likeCountSpan = document.getElementById(`likeCount-${postId}`);
        likeCountSpan.textContent = data.newLikeCount;

        icon.classList.toggle('liked', newLikedState);
        icon.style.color = newLikedState ? 'red' : 'black';
      }
    })
    .catch(err => console.error('Like error:', err));
}


// End of no. of Likes Increasing ===============================================================================


// dropdown on three dots ( ... ) =============================

  function toggleDropdown(id) {
    const dropdown = document.getElementById(`dropdown-${id}`);
    const allDropdowns = document.querySelectorAll(".dropdown-menu");

    // Hide other dropdowns
    allDropdowns.forEach(menu => {
      if (menu !== dropdown) menu.style.display = "none";
    });

    // Toggle this dropdown
    dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    const isDropdownClick = e.target.closest(".edit");
    if (!isDropdownClick) {
      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        menu.style.display = "none";
      });
    }
  });

//   17/4/25 Authorize Try User to delete and Edit Post ==========================================

const isPostAuthor = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");

  if (!post.author.equals(req.user._id)) {
    return res.status(403).send("You are not authorized to perform this action");
  }

  next(); // authorized
};


// END => 17/4/25 Authorize Try User to delete and Edit Post =================================================

// // // javaScript for Friend Request ==================
document.querySelectorAll('.acceptBtn').forEach(button => {
    button.addEventListener('click', function () {
      const profileImage = this.getAttribute('data-profile');
      const senderName = this.getAttribute('data-sender');

      fetch('/messages/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileImage: profileImage,
          senderName: senderName,
          IsActive: "active",
          messageType: "text-bold",
          messageText: ""
        })
      })
      .then(response => {
        if (response.redirected) {
          alert("You both are friends now");
          window.location.href = response.url;
        } else {
          alert("Failed to accept request.");
        }
      })
      .catch(error => {
        console.error(error);
        alert("Something went wrong.");
      });
    });
  });


// Decline Request
document.querySelectorAll('.declineBtn').forEach(button => {
    button.addEventListener('click', function () {
      const friendrequestId = this.getAttribute('data-id');

      fetch('/friendrequests/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendrequestId })
      })
      .then(async response => {
        const data = await response.json();

        if (response.ok) {
          alert("Friend request declined");
          document.getElementById(friendrequestId).remove(); // remove request from UI
        } else {
          alert(data.message || "Failed to decline request.");
        }
      })
      .catch(error => {
        console.error("Client-side error:", error);
        alert("Something went wrong.");
      });
    });
  });

// 

// 16/4/25 << BookMark Functionality >> ======================================================================
// Client-side JavaScript
function savePost(postId, element) {
  const isBookmarked = element.classList.contains('fa-solid');
  
  fetch(`/posts/${postId}/bookmark`, {
      method: isBookmarked ? 'DELETE' : 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          if (isBookmarked) {
              element.classList.remove('fa-solid');
              element.classList.add('fa-regular');
              alert('Post Removed from Bookmarks');
          } else {
              element.classList.remove('fa-regular');
              element.classList.add('fa-solid');
              alert('Post Saved');
          }
      } else {
          alert('Error: ' + data.message);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while processing your request');
  });
}

// END Bookmark Functionality ======================================================


// 

document.getElementById('bookmarks-nav').addEventListener('click', () => {
  window.location.href = '/bookmarks';
});


// END >> 16/4/25 << ======================================================================

// document.getElementById('goToProfileUpload').addEventListener('click', () => {
//   window.location.href = '/profile/upload';
// });

// Redirection to Upload Profile Image Page 
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('goToProfileUpload');
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = '/profile/upload';
    });
  } else {
    console.warn('Element with id goToProfileUpload not found');
  }
});


// 

// Share Dialog Box ======================================== 


document.querySelectorAll('.share-button').forEach(button => {
  button.addEventListener('click', () => {
    const postId = button.getAttribute('data-post-id');
    const shareUrl = `${window.location.origin}/posts/${postId}`;
    const shareText = "Check out this post! 👇";

    if (navigator.share) {
      navigator.share({
        title: "My Post App",
        text: shareText,
        url: shareUrl
      }).then(() => {
        console.log("Post shared successfully");
      }).catch(err => {
        console.error("Sharing failed:", err);
      });
    } else {
      // Fallback if Web Share API isn't supported
      navigator.clipboard.writeText(shareUrl)
        .then(() => showToast("Link Copied!"))
        .catch(err => console.error("Clipboard error", err));
    }
  });
});
// END => Share Dialog box =========================================

// 17/4/25 ============================

// function toggleLike(icon, postId) {
//   fetch(`/posts/${postId}/like`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//   })
//     .then(res => res.json())
//     .then(data => {
//       if (data.success) {
//         icon.classList.toggle('liked', data.liked);

//         const likeCount = document.getElementById(`likeCount-${postId}`);
//         likeCount.textContent = data.newLikeCount;
//       }
//     })
//     .catch(err => console.error("Like Error:", err));
// }
function toggleLike(icon, postId) {
  fetch(`/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Toggle the liked class for styling
        icon.classList.toggle('liked', data.liked);
        icon.style.color = data.liked ? 'red' : 'black';

        // Update the like count on the page
        const likeCount = document.getElementById(`likeCount-${postId}`);
        likeCount.textContent = data.newLikeCount;
      }
    })
    .catch(err => console.error("Like Error:", err));
}

// Changing  1000 → 1K,  10900 → 10.9K,     1000000 → 1M

// function formatLikes(n) {
//   if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
//   if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
//   return n;
// }

// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll('.lc').forEach(span => {
//     const rawCount = parseInt(span.textContent, 10);
//     span.textContent = formatLikes(rawCount);
//   });
// });

// END => 17/4/25 =========================================== 

// Trying to remove (...) edit/delete error:-
function toggleDropdown(id) {
  const dropdown = document.getElementById(`dropdown-${id}`);
  const allDropdowns = document.querySelectorAll(".dropdown-menu");

  allDropdowns.forEach(menu => {
    if (menu !== dropdown) menu.style.display = "none";
  });

  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
}

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  const isDropdownClick = e.target.closest(".edit");
  if (!isDropdownClick) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.style.display = "none";
    });
  }
});

// END Working => ================================================================



// 16:58

// document.addEventListener("DOMContentLoaded", () => {
//   const modal = document.getElementById("commentModal");
//   const closeBtn = document.querySelector(".close-btn");
//   const commentsList = document.getElementById("commentsList");
//   const commentForm = document.getElementById("commentForm");
//   const commentText = document.getElementById("commentText");
//   const commentPostId = document.getElementById("commentPostId");

//   // Function to format time for "time ago" functionality
//   function formatTimeAgo(dateString) {
//     const now = new Date();
//     const commentDate = new Date(dateString);
//     const diffMs = now - commentDate;
//     const diffMinutes = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffMinutes < 1) return "just now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return commentDate.toLocaleDateString(); // fallback
//   }

//   // Handle opening and closing of comment modal
//   document.querySelectorAll(".comment-btn").forEach(btn => {
//     btn.addEventListener("click", async (e) => {
//       e.preventDefault();
//       const postId = btn.dataset.postId;
//       commentPostId.value = postId;

//       const res = await fetch(`/posts/${postId}/comments`);
//       const data = await res.json();

//       // Render comments inside modal
//       commentsList.innerHTML = data.comments.map(c => `
//         <div class="comment" data-comment-id="${c._id}">
//           <div class="comment-header">
//             <img src="/uploads/${c.user.profile_image || 'default-profile.jpg'}" />
//             <span class="username">${c.user.name}</span>
//             <small class="comment-time" style="margin-left: 40px; color: #aaa;">
//               ${formatTimeAgo(c.createdAt)}
//             </small>

//             <!-- Conditional rendering of edit and delete options -->
//             ${c.user._id.toString() === data.currentUserId.toString() ? `
//               <div class="comment-options">
//                 <button class="dots-btn">⋯</button>
//                 <div class="options-menu hidden">
//                   <button class="edit-comment" data-comment-id="${c._id}" data-post-id="${postId}">Edit</button>
//                   <button class="delete-comment" data-comment-id="${c._id}" data-post-id="${postId}">Delete</button>
//                 </div>
//               </div>
//             ` : ''}
//           </div>
          
//           <p class="comment-text">${c.text}</p>
//         </div>
//       `).join('');

//       modal.classList.remove("hidden");

//       // Handle 3-dots menu show/hide
//       document.querySelectorAll(".dots-btn").forEach(dotBtn => {
//         dotBtn.addEventListener("click", (e) => {
//           e.stopPropagation();
//           const menu = dotBtn.nextElementSibling;
//           menu.classList.toggle("hidden");
//         });
//       });

//       // Close options menu when clicking outside
//       document.addEventListener("click", () => {
//         document.querySelectorAll(".options-menu").forEach(menu => {
//           menu.classList.add("hidden");
//         });
//       }, { once: true });
//     });
//   });

//   // Close the comment modal
//   closeBtn.onclick = () => modal.classList.add("hidden");

//   // Close modal when clicking outside of modal content
//   window.addEventListener("click", (e) => {
//     if (!modal.classList.contains("hidden") && !modal.querySelector(".modal-content").contains(e.target)) {
//       modal.classList.add("hidden");
//     }
//   });

//   // Handle comment form submission
//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const postId = commentPostId.value;
//     const text = commentText.value;

//     const res = await fetch(`/posts/${postId}/comments`, {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text })
//     });

//     if (res.ok) {
//       commentText.value = '';
//       document.querySelector(`.comment-btn[data-post-id="${postId}"]`).click();
//     }
//   });

//   // Handle edit comment
//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("edit-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       const currentText = e.target.closest('.comment').querySelector('.comment-text').innerText;
//       const newText = prompt("Edit your comment:", currentText);

//       if (newText) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/edit`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: newText })
//         });

//         const data = await res.json();
//         if (res.ok) {
//           e.target.closest('.comment').querySelector('.comment-text').innerText = newText;
//         } else {
//           alert(data.message || "Error editing comment");
//         }
//       }
//     }
//   });

//   // Handle delete comment
//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("delete-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       if (confirm("Are you sure you want to delete this comment?")) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/delete`, {
//           method: 'DELETE',
//         });

//         const data = await res.json();
//         if (res.ok) {
//           // Remove the comment from the UI
//           e.target.closest('.comment').remove();
//         } else {
//           alert(data.message || "Error deleting comment");
//         }
//       }
//     }
//   });
// });

// END => Working ======================================================================================

// // Trying to add "No Comments yet" =====================================
// document.addEventListener("DOMContentLoaded", () => {
//   const modal = document.getElementById("commentModal");
//   const closeBtn = document.querySelector(".close-btn");
//   const commentsList = document.getElementById("commentsList");
//   const commentForm = document.getElementById("commentForm");
//   const commentText = document.getElementById("commentText");
//   const commentPostId = document.getElementById("commentPostId");

//   function formatTimeAgo(dateString) {
//     const now = new Date();
//     const commentDate = new Date(dateString);
//     const diffMs = now - commentDate;
//     const diffMinutes = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffMinutes < 1) return "just now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return commentDate.toLocaleDateString();
//   }

//   document.querySelectorAll(".comment-btn").forEach(btn => {
//     btn.addEventListener("click", async (e) => {
//       e.preventDefault();
//       const postId = btn.dataset.postId;
//       commentPostId.value = postId;

//       const res = await fetch(`/posts/${postId}/comments`);
//       const data = await res.json();

//       // Render comments or "No Comments yet"
//       if (data.comments.length === 0) {
//         commentsList.innerHTML = `
//           <p class="no-comments" style="color: #777; text-align: center; margin-top: 10px;">
//             No Comments yet
//           </p>`;
//       } else {
//         commentsList.innerHTML = data.comments.map(c => `
//           <div class="comment" data-comment-id="${c._id}">
//             <div class="comment-header">
//               <img src="/uploads/${c.user.profile_image || 'default-profile.jpg'}" />
//               <span class="username">${c.user.name}</span>
//               <small class="comment-time" style="margin-left: 40px; color: #aaa;">
//                 ${formatTimeAgo(c.createdAt)}
//               </small>

//               ${c.user._id.toString() === data.currentUserId.toString() ? `
//                 <div class="comment-options">
//                   <button class="dots-btn">⋯</button>
//                   <div class="options-menu hidden">
//                     <button class="edit-comment" data-comment-id="${c._id}" data-post-id="${postId}">Edit</button>
//                     <button class="delete-comment" data-comment-id="${c._id}" data-post-id="${postId}">Delete</button>
//                   </div>
//                 </div>
//               ` : ''}
//             </div>
//             <p class="comment-text">${c.text}</p>
//           </div>
//         `).join('');
//       }

//       modal.classList.remove("hidden");

//       document.querySelectorAll(".dots-btn").forEach(dotBtn => {
//         dotBtn.addEventListener("click", (e) => {
//           e.stopPropagation();
//           const menu = dotBtn.nextElementSibling;
//           menu.classList.toggle("hidden");
//         });
//       });

//       document.addEventListener("click", () => {
//         document.querySelectorAll(".options-menu").forEach(menu => {
//           menu.classList.add("hidden");
//         });
//       }, { once: true });
//     });
//   });

//   closeBtn.onclick = () => modal.classList.add("hidden");

//   window.addEventListener("click", (e) => {
//     if (!modal.classList.contains("hidden") && !modal.querySelector(".modal-content").contains(e.target)) {
//       modal.classList.add("hidden");
//     }
//   });

//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const postId = commentPostId.value;
//     const text = commentText.value;

//     const res = await fetch(`/posts/${postId}/comments`, {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text })
//     });

//     if (res.ok) {
//       commentText.value = '';
//       document.querySelector(`.comment-btn[data-post-id="${postId}"]`).click();
//     }
//   });

//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("edit-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       const currentText = e.target.closest('.comment').querySelector('.comment-text').innerText;
//       const newText = prompt("Edit your comment:", currentText);

//       if (newText) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/edit`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: newText })
//         });

//         const data = await res.json();
//         if (res.ok) {
//           e.target.closest('.comment').querySelector('.comment-text').innerText = newText;
//         } else {
//           alert(data.message || "Error editing comment");
//         }
//       }
//     }
//   });

//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("delete-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       if (confirm("Are you sure you want to delete this comment?")) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/delete`, {
//           method: 'DELETE',
//         });

//         const data = await res.json();
//         if (res.ok) {
//           e.target.closest('.comment').remove();

//           // Check if there are any comments left, and show "No Comments yet" if none
//           if (!commentsList.querySelector('.comment')) {
//             commentsList.innerHTML = `
//               <p class="no-comments" style="color: #777; text-align: center; margin-top: 10px;">
//                 No Comments yet
//               </p>`;
//           }
//         } else {
//           alert(data.message || "Error deleting comment");
//         }
//       }
//     }
//   });
// });

// with Message => this post is lonely =========================================================================================
// document.addEventListener("DOMContentLoaded", () => {
//   const modal = document.getElementById("commentModal");
//   const closeBtn = document.querySelector(".close-btn");
//   const commentsList = document.getElementById("commentsList");
//   const commentForm = document.getElementById("commentForm");
//   const commentText = document.getElementById("commentText");
//   const commentPostId = document.getElementById("commentPostId");

//   // Function to format time for "time ago" functionality
//   function formatTimeAgo(dateString) {
//     const now = new Date();
//     const commentDate = new Date(dateString);
//     const diffMs = now - commentDate;
//     const diffMinutes = Math.floor(diffMs / (1000 * 60));
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffMinutes < 1) return "just now";
//     if (diffMinutes < 60) return `${diffMinutes}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return commentDate.toLocaleDateString(); // fallback
//   }

//   // Handle opening and closing of comment modal
//   document.querySelectorAll(".comment-btn").forEach(btn => {
//     btn.addEventListener("click", async (e) => {
//       e.preventDefault();
//       const postId = btn.dataset.postId;
//       commentPostId.value = postId;

//       const res = await fetch(`/posts/${postId}/comments`);
//       const data = await res.json();

//       // Render comments inside modal or display message if no comments
//       if (data.comments.length === 0) {
//         commentsList.innerHTML = `
//           <div class="no-comments" style="color: #777; text-align: center; margin-top: 20px;">
//             <p>👀 This post is lonely... it's like a party with no music! 🎉</p>
//             <p>Give it some company and let’s get the fun started with a comment! 🎶</p>
//           </div>`;
//       } else {
//         commentsList.innerHTML = data.comments.map(c => `
//           <div class="comment" data-comment-id="${c._id}">
//             <div class="comment-header">
//               <img src="/uploads/${c.user.profile_image || 'default-profile.jpg'}" />
//               <span class="username">${c.user.name}</span>
//               <small class="comment-time" style="margin-left: 40px; color: #aaa;">
//                 ${formatTimeAgo(c.createdAt)}
//               </small>

//               <!-- Conditional rendering of edit and delete options -->
//               ${c.user._id.toString() === data.currentUserId.toString() ? `
//                 <div class="comment-options">
//                   <button class="dots-btn">⋯</button>
//                   <div class="options-menu hidden">
//                     <button class="edit-comment" data-comment-id="${c._id}" data-post-id="${postId}">Edit</button>
//                     <button class="delete-comment" data-comment-id="${c._id}" data-post-id="${postId}">Delete</button>
//                   </div>
//                 </div>
//               ` : ''}
//             </div>
            
//             <p class="comment-text">${c.text}</p>
//           </div>
//         `).join('');
//       }

//       modal.classList.remove("hidden");

//       // Handle 3-dots menu show/hide
//       document.querySelectorAll(".dots-btn").forEach(dotBtn => {
//         dotBtn.addEventListener("click", (e) => {
//           e.stopPropagation();
//           const menu = dotBtn.nextElementSibling;
//           menu.classList.toggle("hidden");
//         });
//       });

//       // Close options menu when clicking outside
//       document.addEventListener("click", () => {
//         document.querySelectorAll(".options-menu").forEach(menu => {
//           menu.classList.add("hidden");
//         });
//       }, { once: true });
//     });
//   });

//   // Close the comment modal
//   closeBtn.onclick = () => modal.classList.add("hidden");

//   // Close modal when clicking outside of modal content
//   window.addEventListener("click", (e) => {
//     if (!modal.classList.contains("hidden") && !modal.querySelector(".modal-content").contains(e.target)) {
//       modal.classList.add("hidden");
//     }
//   });

//   // Handle comment form submission
//   commentForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const postId = commentPostId.value;
//     const text = commentText.value;

//     const res = await fetch(`/posts/${postId}/comments`, {
//       method: "POST",
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text })
//     });

//     if (res.ok) {
//       commentText.value = '';
//       document.querySelector(`.comment-btn[data-post-id="${postId}"]`).click();
//     }
//   });

//   // Handle edit comment
//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("edit-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       const currentText = e.target.closest('.comment').querySelector('.comment-text').innerText;
//       const newText = prompt("Edit your comment:", currentText);

//       if (newText) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/edit`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: newText })
//         });

//         const data = await res.json();
//         if (res.ok) {
//           e.target.closest('.comment').querySelector('.comment-text').innerText = newText;
//         } else {
//           alert(data.message || "Error editing comment");
//         }
//       }
//     }
//   });

//   // Handle delete comment
//   commentsList.addEventListener("click", async (e) => {
//     if (e.target.classList.contains("delete-comment")) {
//       const commentId = e.target.dataset.commentId;
//       const postId = e.target.dataset.postId;

//       if (confirm("Are you sure you want to delete this comment?")) {
//         const res = await fetch(`/posts/${postId}/comments/${commentId}/delete`, {
//           method: 'DELETE',
//         });

//         const data = await res.json();
//         if (res.ok) {
//           // Remove the comment from the UI
//           e.target.closest('.comment').remove();
          
//           // If there are no more comments, show the "No Comments yet" message
//           if (!commentsList.querySelector('.comment')) {
//             commentsList.innerHTML = `
//               <div class="no-comments" style="color: #777; text-align: center; margin-top: 20px;">
//                 <p>👀 This post is lonely... it's like a party with no music! 🎉</p>
//                 <p>Give it some company and let’s get the fun started with a comment! 🎶</p>
//               </div>`;
//           }
//         } else {
//           alert(data.message || "Error deleting comment");
//         }
//       }
//     }
//   });
// });

// Both the messages =================================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("commentModal");
  const closeBtn = document.querySelector(".close-btn");
  const commentsList = document.getElementById("commentsList");
  const commentForm = document.getElementById("commentForm");
  const commentText = document.getElementById("commentText");
  const commentPostId = document.getElementById("commentPostId");

  // Function to format time for "time ago" functionality
  function formatTimeAgo(dateString) {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return commentDate.toLocaleDateString(); // fallback
  }

  // Handle opening and closing of comment modal
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const postId = btn.dataset.postId;
      commentPostId.value = postId;

      const res = await fetch(`/posts/${postId}/comments`);
      const data = await res.json();

      // Render comments inside modal or display message if no comments
      if (data.comments.length === 0) {
        commentsList.innerHTML = `
          <div class="no-comments" style="color: #777; text-align: center; margin-top: 20px;">
            <p><strong>No Comments yet</strong></p>
            <p>👀 This post is lonely... it's like a party with no music! 🎉</p>
            <p>Give it some company and let’s get the fun started with a comment! 🎶</p>
          </div>`;
      } else {
        commentsList.innerHTML = data.comments.map(c => `
          <div class="comment" data-comment-id="${c._id}">
            <div class="comment-header">
              <img src="/uploads/${c.user.profile_image || 'default-profile.jpg'}" />
              <span class="username">${c.user.name}</span>
              <small class="comment-time" style="margin-left: 40px; color: #aaa;">
                ${formatTimeAgo(c.createdAt)}
              </small>

              <!-- Conditional rendering of edit and delete options -->
              ${c.user._id.toString() === data.currentUserId.toString() ? `
                <div class="comment-options">
                  <button class="dots-btn">⋯</button>
                  <div class="options-menu hidden">
                    <button class="edit-comment" data-comment-id="${c._id}" data-post-id="${postId}">Edit</button>
                    <button class="delete-comment" data-comment-id="${c._id}" data-post-id="${postId}">Delete</button>
                  </div>
                </div>
              ` : ''}
            </div>
            
            <p class="comment-text">${c.text}</p>
          </div>
        `).join('');
      }

      modal.classList.remove("hidden");

      // Handle 3-dots menu show/hide
      document.querySelectorAll(".dots-btn").forEach(dotBtn => {
        dotBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const menu = dotBtn.nextElementSibling;
          menu.classList.toggle("hidden");
        });
      });

      // Close options menu when clicking outside
      document.addEventListener("click", () => {
        document.querySelectorAll(".options-menu").forEach(menu => {
          menu.classList.add("hidden");
        });
      }, { once: true });
    });
  });

  // Close the comment modal
  closeBtn.onclick = () => modal.classList.add("hidden");

  // Close modal when clicking outside of modal content
  window.addEventListener("click", (e) => {
    if (!modal.classList.contains("hidden") && !modal.querySelector(".modal-content").contains(e.target)) {
      modal.classList.add("hidden");
    }
  });

  // Handle comment form submission
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const postId = commentPostId.value;
    const text = commentText.value;

    const res = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (res.ok) {
      commentText.value = '';
      document.querySelector(`.comment-btn[data-post-id="${postId}"]`).click();
    }
  });

  // Handle edit comment
  commentsList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-comment")) {
      const commentId = e.target.dataset.commentId;
      const postId = e.target.dataset.postId;

      const currentText = e.target.closest('.comment').querySelector('.comment-text').innerText;
      const newText = prompt("Edit your comment:", currentText);

      if (newText) {
        const res = await fetch(`/posts/${postId}/comments/${commentId}/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newText })
        });

        const data = await res.json();
        if (res.ok) {
          e.target.closest('.comment').querySelector('.comment-text').innerText = newText;
        } else {
          alert(data.message || "Error editing comment");
        }
      }
    }
  });

  // Handle delete comment
  commentsList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-comment")) {
      const commentId = e.target.dataset.commentId;
      const postId = e.target.dataset.postId;

      if (confirm("Are you sure you want to delete this comment?")) {
        const res = await fetch(`/posts/${postId}/comments/${commentId}/delete`, {
          method: 'DELETE',
        });

        const data = await res.json();
        if (res.ok) {
          // Remove the comment from the UI
          e.target.closest('.comment').remove();
          
          // If there are no more comments, show the "No Comments yet" message
          if (!commentsList.querySelector('.comment')) {
            commentsList.innerHTML = `
              <div class="no-comments" style="color: #777; text-align: center; margin-top: 20px;">
                <p><strong>No Comments yet</strong></p>
                <p>👀 This post is lonely... it's like a party with no music! 🎉</p>
                <p>Give it some company and let’s get the fun started with a comment! 🎶</p>
              </div>`;
          }
        } else {
          alert(data.message || "Error deleting comment");
        }
      }
    }
  });
});


// END => Both Messsages ==================================================



// END 27/4/25 =================================

// 16/5/2025 => Code for settings.ejs Page Redirection

document.getElementById("settingsBtn").addEventListener("click", () => {
  window.location.href = "/setting";
});

// 19/05/2025 => Code for Explore.ejs Page Redirection
document.getElementById("exploreBtn").addEventListener("click", function () {
    window.location.href = "/explore";
  });

  // 20/05/2025 => Code for messages.ejs Page Redirection

    document.getElementById("messagesBtn").addEventListener("click", function () {
    window.location.href = "/messages";
  });

// 20/05/2025 => Code for User Profie .ejs Page Redirection
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('profileHandle').addEventListener('click', function () {
    window.location.href = "/profile/" + currentUsername;
  });
});

// Code for User Analytic.ejs Page Redirection
document.getElementById("analyticsBtn").addEventListener("click", function () {
  window.location.href = "/analytic";
});


// 20/05/2025 => Code When User searches URL Post
document.addEventListener("DOMContentLoaded", function () {
    const hash = window.location.hash;
    if (hash) {
      const post = document.querySelector(hash);
      if (post) {
        post.scrollIntoView({ behavior: "smooth", block: "center" });

        // Optional: highlight it briefly
        post.style.transition = "background 0.5s";
        post.style.background = "#fffae6"; // light yellow
        setTimeout(() => {
          post.style.background = "";
        }, 1500);
      }
    }
  });
  
// END => 20/05/2025 => Code When User searches URL Post

  
// <%= currentUser.name %>

// Working => 22/05/2025

  // const input = document.getElementById('user-search-input');
  // const suggestionsBox = document.getElementById('search-suggestions');

  // input.addEventListener('input', async () => {
  //   const query = input.value.trim();
  //   suggestionsBox.innerHTML = '';

  //   if (query.length === 0) return;

  //   try {
  //     const res = await fetch(`/live-user-search?q=${query}`);
  //     const users = await res.json();

  //     users.forEach(user => {
  //       const profileImage = user.profile_image
  //         ? `/uploads/${user.profile_image}`
  //         : '/images/default-profile.png';

  //       const li = document.createElement('li');
  //       li.innerHTML = `
  //         <a href="/profiles/${user._id}">
  //           <img src="${profileImage}" alt="Profile" class="mini-profile-img" />
  //           <div class="suggestion-text">
  //             <strong>${user.name}</strong><br/>
  //             <span>@${user.username}</span>
  //           </div>
  //         </a>
  //       `;
  //       suggestionsBox.appendChild(li);
  //     });
  //   } catch (err) {
  //     console.error('Search failed:', err);
  //   }
  // });

  // // Optional: Hide on outside click
  // document.addEventListener('click', (e) => {
  //   if (!e.target.closest('.search-bar')) {
  //     suggestionsBox.innerHTML = '';
  //   }
  // });
// END => Working => 22/05/2025



// Try 2 => 22/05/2025 =>Adding search functionality

  // const input = document.getElementById('user-search-input');
  // const suggestionsBox = document.getElementById('search-suggestions');

  // let selectedIndex = -1;
  // let debounceTimer;

  // // Debounce function to limit API calls
  // function debounce(func, delay) {
  //   return function(...args) {
  //     clearTimeout(debounceTimer);
  //     debounceTimer = setTimeout(() => func.apply(this, args), delay);
  //   };
  // }

  // async function fetchSuggestions(query) {
  //   if (!query) {
  //     suggestionsBox.innerHTML = '';
  //     selectedIndex = -1;
  //     input.setAttribute('aria-expanded', 'false');
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`/live-user-search?q=${encodeURIComponent(query)}`);
  //     if (!res.ok) throw new Error('Network error');
  //     const users = await res.json();

  //     suggestionsBox.innerHTML = '';
  //     selectedIndex = -1;

  //     if (users.length === 0) {
  //       input.setAttribute('aria-expanded', 'false');
  //       return;
  //     }

  //     users.forEach((user, index) => {
  //       const profileImage = user.profile_image
  //         ? `/uploads/${user.profile_image}`
  //         : '/images/default-profile.png';

  //       const li = document.createElement('li');
  //       li.tabIndex = -1;
  //       li.setAttribute('role', 'option');
  //       li.setAttribute('id', `suggestion-${index}`);

  //       li.innerHTML = `
  //         <a href="/profiles/${user._id}">
  //           <img src="${profileImage}" alt="Profile image of ${user.name}" class="mini-profile-img" />
  //           <div class="suggestion-text">
  //             <strong>${user.name}</strong><br/>
  //             <span>@${user.username}</span>
  //           </div>
  //         </a>
  //       `;

  //       li.addEventListener('click', () => {
  //         suggestionsBox.innerHTML = '';
  //         input.setAttribute('aria-expanded', 'false');
  //       });

  //       suggestionsBox.appendChild(li);
  //     });

  //     input.setAttribute('aria-expanded', 'true');
  //   } catch (err) {
  //     console.error('Search failed:', err);
  //     suggestionsBox.innerHTML = '';
  //     selectedIndex = -1;
  //     input.setAttribute('aria-expanded', 'false');
  //   }
  // }

  // input.addEventListener('input', debounce((e) => {
  //   fetchSuggestions(e.target.value.trim());
  // }, 300)); // 300ms debounce

  // input.addEventListener('keydown', (e) => {
  //   const items = suggestionsBox.querySelectorAll('li');
  //   if (items.length === 0) return;

  //   if (e.key === 'ArrowDown') {
  //     e.preventDefault();
  //     selectedIndex = (selectedIndex + 1) % items.length;
  //     updateSelection(items);
  //   } else if (e.key === 'ArrowUp') {
  //     e.preventDefault();
  //     selectedIndex = (selectedIndex - 1 + items.length) % items.length;
  //     updateSelection(items);
  //   } else if (e.key === 'Enter') {
  //     if (selectedIndex >= 0 && items[selectedIndex]) {
  //       e.preventDefault();
  //       const link = items[selectedIndex].querySelector('a');
  //       if (link) window.location.href = link.href;
  //     }
  //   } else if (e.key === 'Escape') {
  //     suggestionsBox.innerHTML = '';
  //     selectedIndex = -1;
  //     input.setAttribute('aria-expanded', 'false');
  //   }
  // });

  // function updateSelection(items) {
  //   items.forEach((item, idx) => {
  //     if (idx === selectedIndex) {
  //       item.classList.add('selected');
  //       input.setAttribute('aria-activedescendant', item.id);
  //       item.scrollIntoView({ block: 'nearest' });
  //     } else {
  //       item.classList.remove('selected');
  //     }
  //   });
  // }

  // // Hide suggestions on outside click
  // document.addEventListener('click', (e) => {
  //   if (!e.target.closest('.search_bar')) {
  //     suggestionsBox.innerHTML = '';
  //     selectedIndex = -1;
  //     input.setAttribute('aria-expanded', 'false');
  //   }
  // });


// END Try 2 => Working FINE


// Try 3
const searchInput = document.querySelector('.searchbar');
const searchContainer = document.querySelector('.search_bar');

// Create a container for suggestions dropdown
const suggestionsBox = document.createElement('div');
suggestionsBox.classList.add('suggestions');
suggestionsBox.style.position = 'absolute';
suggestionsBox.style.top = '100%';
suggestionsBox.style.left = '0';
suggestionsBox.style.right = '0';
suggestionsBox.style.background = 'white';
suggestionsBox.style.border = '1px solid #ddd';
suggestionsBox.style.borderTop = 'none';
suggestionsBox.style.maxHeight = '250px';
suggestionsBox.style.overflowY = 'auto';
suggestionsBox.style.zIndex = '1000';
suggestionsBox.style.display = 'none'; // hidden initially

searchContainer.style.position = 'relative'; // make sure container is positioned
searchContainer.appendChild(suggestionsBox);

searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  if (query.length === 0) {
    suggestionsBox.style.display = 'none';
    suggestionsBox.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`/live-user-search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');

    const users = await response.json();

    if (users.length === 0) {
      suggestionsBox.style.display = 'none';
      suggestionsBox.innerHTML = '';
      return;
    }

    suggestionsBox.innerHTML = users.map(user => {
      // If user.name is "You", show that, else show actual name
      const displayName = user.name === 'You' ? 'You' : user.name;

      return `
        <a href="/profiles/${user._id}" class="suggestion-item" style="display:flex; align-items:center; padding:8px; text-decoration:none; color:#000; border-bottom:1px solid #eee;">
          <img src="/uploads/${user.profile_image}" alt="${displayName} profile" style="width:32px; height:32px; border-radius:50%; object-fit:cover; margin-right:10px;">
          <div>
            <div style="font-weight:600;">${displayName}</div>
            
          </div>
        </a>
      `;
    }).join('');
// Use to show email below displayName (in blank line)<div style="font-size:12px; color:#666;">@${user.username}</div>
    suggestionsBox.style.display = 'block';
  } catch (err) {
    console.error(err);
    suggestionsBox.style.display = 'none';
    suggestionsBox.innerHTML = '';
  }
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search_bar')) {
    suggestionsBox.style.display = 'none';
  }
});


// END Try 3


// Try 5 for showing No. of Requests
document.addEventListener("submit", async function(e) {
  const form = e.target;
  const action = form.getAttribute("action");

  if (action && (action.startsWith("/accept-request/") || action.startsWith("/decline-request/"))) {
    e.preventDefault(); // Stop form from submitting normally

    const method = form.getAttribute("method") || "POST";
    const res = await fetch(action, { method });

    if (res.ok) {
      // Remove the parent `.request` element
      const requestElem = form.closest(".request");
      requestElem?.remove();

      // Decrease the count
      const countElem = document.getElementById("requestCount");
      const current = parseInt(countElem.textContent || "0");
      countElem.textContent = current - 1;

      // If none left, show "No new friend requests"
      if (document.querySelectorAll(".request").length === 0) {
        const container = document.querySelector(".requests-container");
        container.innerHTML = "<p>No new friend requests</p>";
      }
    }
  }
});

// Try 5 Showing Requests