from PIL import Image


def main() -> None:
    in_path = "public/og-image.png"
    out_path = "public/og-image.png"

    im = Image.open(in_path).convert("RGB")
    w, h = im.size

    tw, th = 1200, 630
    target_aspect = tw / th
    cur_aspect = w / h

    if cur_aspect > target_aspect:
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = int(w / target_aspect)
        top = (h - new_h) // 2
        box = (0, top, w, top + new_h)

    im2 = im.crop(box).resize((tw, th), Image.LANCZOS)
    im2.save(out_path, format="PNG", optimize=True)
    print("saved", im2.size)


if __name__ == "__main__":
    main()

