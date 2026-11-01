import qrcode
import qrcode.image.svg as svg

# Your link
data = "https://www.inkosi-chorale.kanchtech.com"

# ----------------------------
# 1. Generate PNG QR Code
# ----------------------------
qr_png = qrcode.make(data)
qr_png.save("inkosi_chorale_qr_code.png")

# ----------------------------
# 2. Generate JPG QR Code
# ----------------------------
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(data)
qr.make(fit=True)

img_jpg = qr.make_image(fill_color="black", back_color="white")
img_jpg.save("inkosi_chorale_qr_code.jpg")

# ----------------------------
# 3. Generate SVG QR Code
# ----------------------------
factory = svg.SvgImage
qr_svg = qrcode.make(data, image_factory=factory)
qr_svg.save("inkosi_chorale_qr_code.svg")

# ----------------------------
# 4. Generate High-Resolution PNG
# ----------------------------
qr_high_res = qrcode.QRCode(
    version=5,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,  # Higher = bigger image
    border=4,
)
qr_high_res.add_data(data)
qr_high_res.make(fit=True)

img_high_res = qr_high_res.make_image(fill_color="black", back_color="white")
img_high_res.save("qr_coinkosi_chorale_qr_codede_high_res.png")

print("QR codes generated successfully!")