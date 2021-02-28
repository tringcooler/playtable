#! python3
# coding: utf-8

from PIL import Image, ImageDraw, ImageFilter

def rounded_rectangle(self: ImageDraw, xy, corner_radius, fill=None, outline=None):
    upper_left_point = xy[0]
    bottom_right_point = xy[1]
    self.rectangle(
        [
            (upper_left_point[0], upper_left_point[1] + corner_radius),
            (bottom_right_point[0], bottom_right_point[1] - corner_radius)
        ],
        fill=fill,
        outline=outline
    )
    self.rectangle(
        [
            (upper_left_point[0] + corner_radius, upper_left_point[1]),
            (bottom_right_point[0] - corner_radius, bottom_right_point[1])
        ],
        fill=fill,
        outline=outline
    )
    self.pieslice([upper_left_point, (upper_left_point[0] + corner_radius * 2, upper_left_point[1] + corner_radius * 2)],
        180,
        270,
        fill=fill,
        outline=outline
    )
    self.pieslice([(bottom_right_point[0] - corner_radius * 2, bottom_right_point[1] - corner_radius * 2), bottom_right_point],
        0,
        90,
        fill=fill,
        outline=outline
    )
    self.pieslice([(upper_left_point[0], bottom_right_point[1] - corner_radius * 2), (upper_left_point[0] + corner_radius * 2, bottom_right_point[1])],
        90,
        180,
        fill=fill,
        outline=outline
    )
    self.pieslice([(bottom_right_point[0] - corner_radius * 2, upper_left_point[1]), (bottom_right_point[0], upper_left_point[1] + corner_radius * 2)],
        270,
        360,
        fill=fill,
        outline=outline
    )

ImageDraw.ImageDraw.rounded_rectangle = rounded_rectangle

class c_card:

    def __init__(self, size):
        self.size = size
        self.card_img = Image.new('RGBA', self.size)

    def load_img(self, fn):
        return Image.open(fn).convert('RGBA')

    def make(self):
        self.card_img = self.load_img('../../assets/img/box.png')
        frame, fmask = self.make_frame_layer()
        print(self.card_img.mode, frame.mode)
        self.overlay(frame)
        self.cutmask(fmask)

    def show(self):
        self.card_img.show()

    def cutmask(self, msk):
        blank = Image.new('RGBA', self.size)
        self.card_img = Image.composite(self.card_img, blank, msk)

    def overlay(self, img):
        self.card_img = Image.alpha_composite(self.card_img, img)

    def make_frame_layer(self):
        dimg = Image.new('RGBA', self.size)
        draw = ImageDraw.Draw(dimg)
        draw.rounded_rectangle(((0, 0), self.size), 20, fill = 'grey')
        #mask = dimg.filter(ImageFilter.FIND_EDGES)
        mask = dimg.convert('L').point(
            lambda x : 255 if x > 10 else 0, mode='1')
        draw.rounded_rectangle(((5, 5), (self.size[0] - 5, self.size[1] - 5)),
                               15, fill = (0, 0, 0, 0))
        return dimg, mask

if __name__ == '__main__':
    foo = c_card((250, 350))
    foo.make()
    foo.show()
    
