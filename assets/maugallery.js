(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
  );
  $(".gallery").on("click", ".mg-next", () =>
    $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
    const modal = $(`#${lightboxId}`);
    const modalImage = modal.find(".lightboxImage");
    
    // Mettre à jour l'image
    modalImage.attr("src", element.attr("src"));
    
    // Ouvrir la modale avec les bons attributs ARIA
    modal.modal("show")
         .attr("aria-hidden", "false")
         .attr("aria-modal", "true")
         .removeAttr("tabindex");
    
    // Gérer le focus
    modal.on("shown.bs.modal", function() {
        modalImage.focus();
    });
modal.on("keydown", function(e) {
  const focusableElements = modal.find('button')
    .filter(':visible');
  
  const firstElement = focusableElements.first()[0];
  const lastElement = focusableElements.last()[0];

  if (e.key === "Tab") {
    if (e.shiftKey) { // shift + tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else { // tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});
    // Gérer la fermeture et le retour du focus
    modal.on("hidden.bs.modal", function() {
        modal.attr("aria-hidden", "true");
        element.focus();
    });
    
},
    /* clique slide gauche modal */
    prevImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
              .children("img")
              .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i ;
        }
      });
      next =
        imagesCollection[index -1]
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    /* clique slide droite modal */
    nextImage() {
      let activeImage = null;
      $("img.gallery-item").each(function() {
        if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
          activeImage = $(this);
        }
      });
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      let imagesCollection = [];
      if (activeTag === "all") {
        $(".item-column").each(function() {
          if ($(this).children("img").length) {
            imagesCollection.push($(this).children("img"));
            
          }
        });
      } else {
        $(".item-column").each(function() {
          if (
            $(this)
            .children("img")
            .data("gallery-tag") === activeTag
          ) {
            imagesCollection.push($(this).children("img"));
          }
        });
      }
      let index = 0,
        next = null;

      $(imagesCollection).each(function(i) {
        if ($(activeImage).attr("src") === $(this).attr("src")) {
          index = i;
        }
      });
      next = imagesCollection[index +1];
      $(".lightboxImage").attr("src", $(next).attr("src"));
    },
    createLightBox(gallery, lightboxId, navigation) {
    gallery.append(`<div class="modal fade" id="${
        lightboxId ? lightboxId : "galleryLightbox"
    }" role="dialog" aria-labelledby="lightboxTitle">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                <h2 id="lightboxTitle" class="visually-hidden">Affichage d'une image en plein écran</h2>

                    ${
                        navigation
                            ? '<button class="mg-prev" aria-label="Image précédente" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</button>'
                            : '<span style="display:none;" />'
                    }
                    <img class="lightboxImage img-fluid" 
                         tabindex="0"
                         alt="Image en plein écran"
                         aria-labelledby="lightboxTitle"/>
                    ${
                        navigation
                            ? '<button class="mg-next" aria-label="Image suivante" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></button>'
                            : '<span style="display:none;" />'
                    }
                </div>
            </div>
        </div>
    </div>`);
},
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() {
      if ($(this).hasClass("active-tag")) {
        return;
      }
      $(".active-tag").removeClass("active active-tag");
      $(this).addClass("active active-tag");

      var tag = $(this).data("images-toggle");

      $(".gallery-item").each(function() {
        $(this)
        .parents(".item-column")
        .hide();
        if (tag === "all") {
          $(this)
          .parents(".item-column")
          .show(300);
        } else if ($(this).data("gallery-tag") === tag) {
          $(this)
            .parents(".item-column")
            .show(300);
        }
      });
    }
  };
})(jQuery);
