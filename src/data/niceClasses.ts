export interface NiceClassInfo {
  code: number;
  category: 'goods' | 'services';
  title_vi: string;
  title_en: string;
  description_vi: string;
}

export const NICE_CLASSES: NiceClassInfo[] = [
  // Hàng hóa (Goods 1-34)
  { code: 1, category: 'goods', title_vi: 'Hóa chất dùng trong công nghiệp, khoa học, nhiếp ảnh', title_en: 'Chemicals for industry, science, photography', description_vi: 'Hóa chất dùng trong công nghiệp, khoa học, nông nghiệp, lâm nghiệp, phân bón, hợp chất dập lửa.' },
  { code: 2, category: 'goods', title_vi: 'Sơn, véc-ni, chất sơn phủ chống rỉ', title_en: 'Paints, varnishes, lacquers', description_vi: 'Sơn, chất màu, thuốc nhuộm, chất chống ăn mòn, nhựa tự nhiên thô.' },
  { code: 3, category: 'goods', title_vi: 'Mỹ phẩm, chất tẩy rửa, chế phẩm vệ sinh', title_en: 'Cosmetics, cleaning preparations, toiletries', description_vi: 'Mỹ phẩm, nước hoa, xà phòng, chất tẩy rửa gia dụng, kem đánh răng, sản phẩm chăm sóc da.' },
  { code: 4, category: 'goods', title_vi: 'Dầu mỡ công nghiệp, nhiên liệu, nến', title_en: 'Industrial oils, greases, fuels, illuminants', description_vi: 'Dầu mỡ kỹ thuật, bôi trơn, nhiên liệu động cơ, nến thắp sáng.' },
  { code: 5, category: 'goods', title_vi: 'Dược phẩm, chế phẩm y tế, thực phẩm chức năng', title_en: 'Pharmaceuticals, medical preparations, dietary supplements', description_vi: 'Thuốc chữa bệnh, dược phẩm y tế, chất diệt khuẩn, thực phẩm bổ sung dinh dưỡng, vật liệu băng bó.' },
  { code: 6, category: 'goods', title_vi: 'Kim loại thường và hợp kim, vật liệu xây dựng kim loại', title_en: 'Common metals and their alloys, metal building materials', description_vi: 'Kim loại thô, ống dẫn kim loại, khóa cửa, cáp kim loại, thùng chứa bằng kim loại.' },
  { code: 7, category: 'goods', title_vi: 'Máy móc, động cơ, máy công nghiệp', title_en: 'Machines, machine tools, motors and engines', description_vi: 'Máy móc sản xuất, động cơ (trừ xe cộ), máy nông nghiệp, máy tự động.' },
  { code: 8, category: 'goods', title_vi: 'Dụng cụ cầm tay thủ công, dao kéo', title_en: 'Hand tools and implements, cutlery', description_vi: 'Dụng cụ thủ công dùng tay, búa, kìm, bộ dao muỗng nĩa, dụng cụ làm tóc dùng tay.' },
  { code: 9, category: 'goods', title_vi: 'Thiết bị điện tử, phần mềm, viễn thông, kính mắt', title_en: 'Electronics, software, telecommunications, eyewear', description_vi: 'Phần mềm máy tính, ứng dụng mobile, điện thoại thông minh, thiết bị đo lường, kính mắt, pin, thiết bị âm thanh.' },
  { code: 10, category: 'goods', title_vi: 'Thiết bị y tế, dụng cụ nha khoa', title_en: 'Surgical, medical, dental apparatus', description_vi: 'Thiết bị phẫu thuật, khẩu trang y tế, thiết bị đo huyết áp, dụng cụ chỉnh hình.' },
  { code: 11, category: 'goods', title_vi: 'Thiết bị chiếu sáng, sưởi ấm, làm mát, vệ sinh', title_en: 'Lighting, heating, cooling, cooking equipment', description_vi: 'Đèn chiếu sáng, máy điều hòa, tủ lạnh, bếp gas, thiết bị lọc nước, vòi tắm.' },
  { code: 12, category: 'goods', title_vi: 'Xe cộ, phương tiện giao thông đường bộ, đường thủy, hàng không', title_en: 'Vehicles, apparatus for locomotion by land, air or water', description_vi: 'Ô tô, xe máy, xe điện, xe đạp, máy bay, tàu thủy, phụ tùng xe.' },
  { code: 13, category: 'goods', title_vi: 'Vũ khí, đạn dược, chất nổ, pháo hoa', title_en: 'Firearms, ammunition, explosives, fireworks', description_vi: 'Súng đạn, chất nổ công nghiệp, pháo hoa.' },
  { code: 14, category: 'goods', title_vi: 'Trang sức, đá quý, đồng hồ', title_en: 'Jewelry, precious stones, horological instruments', description_vi: 'Vàng bạc trang sức, kim cương, đồng hồ đeo tay, đồng hồ treo tường.' },
  { code: 15, category: 'goods', title_vi: 'Nhạc cụ', title_en: 'Musical instruments', description_vi: 'Đàn piano, guitar, trống, nhạc cụ điện tử.' },
  { code: 16, category: 'goods', title_vi: 'Giấy, bìa cứng, văn phòng phẩm, ấn phẩm', title_en: 'Paper, cardboard, stationery, printed matter', description_vi: 'Sách, tạp chí, bao bì giấy, văn phòng phẩm, vật liệu vẽ, tem nhãn.' },
  { code: 17, category: 'goods', title_vi: 'Cao su, nhựa dạng bán thành phẩm, chất cách điện', title_en: 'Rubber, plastics, insulating materials', description_vi: 'Ống cao su, màng nhựa cách nhiệt, chất chống thấm.' },
  { code: 18, category: 'goods', title_vi: 'Da và giả da, túi xách, vali, ô dù', title_en: 'Leather, imitation leather, bags, luggage, umbrellas', description_vi: 'Ví da, túi xách, vali du lịch, dây nịt da, ô dù.' },
  { code: 19, category: 'goods', title_vi: 'Vật liệu xây dựng phi kim loại', title_en: 'Building materials (non-metallic)', description_vi: 'Xi măng, gạch, đá xây dựng, gỗ công nghiệp, kính xây dựng.' },
  { code: 20, category: 'goods', title_vi: 'Đồ nội thất, gương, khung ảnh, đồ nhựa gia dụng', title_en: 'Furniture, mirrors, picture frames', description_vi: 'Bàn ghế, giường tủ, đồ gỗ nội thất, nệm, khung tranh.' },
  { code: 21, category: 'goods', title_vi: 'Dụng cụ nhà bếp, thủy tinh, gốm sứ gia dụng', title_en: 'Household or kitchen utensils and containers, glassware', description_vi: 'Nồi chảo, ly cốc thủy tinh, bát đĩa gốm sứ, bình giữ nhiệt, dụng cụ lau dọn.' },
  { code: 22, category: 'goods', title_vi: 'Dây thừng, lưới, lều bạt, vật liệu chèn lót', title_en: 'Ropes, string, nets, tents, awnings', description_vi: 'Dây thừng, lều cắm trại, bao tải, sợi tổng hợp.' },
  { code: 23, category: 'goods', title_vi: 'Chỉ khâu, sợi dùng cho dệt may', title_en: 'Yarns and threads for textile use', description_vi: 'Chỉ khâu, sợi dệt, sợi cotton.' },
  { code: 24, category: 'goods', title_vi: 'Vải dệt, chăn ga gối đệm, khăn tắm', title_en: 'Textiles, bed and table covers', description_vi: 'Vải dệt, ga trải giường, khăn tắm, rèm cửa fabric.' },
  { code: 25, category: 'goods', title_vi: 'Quần áo, giày dép, mũ nón', title_en: 'Clothing, footwear, headwear', description_vi: 'Trang phục nam nữ trẻ em, đồng phục, giày thể thao, dép, nón lưỡi trai.' },
  { code: 26, category: 'goods', title_vi: 'Dải ren, thêu, dây ruy-băng, hoa giả', title_en: 'Lace, braid and embroidery, artificial flowers', description_vi: 'Khuy bấm, khóa kéo, hoa giả, nút áo.' },
  { code: 27, category: 'goods', title_vi: 'Thảm, chiếu, vật liệu trải sàn', title_en: 'Carpets, rugs, mats and matting, linoleum', description_vi: 'Thảm trải sàn, chiếu trãi, cỏ nhân tạo.' },
  { code: 28, category: 'goods', title_vi: 'Đồ chơi, trò chơi, dụng cụ thể thao', title_en: 'Games, toys, video game apparatus, sports equipment', description_vi: 'Đồ chơi trẻ em, thiết bị tập gym, bóng đá, gậy golf, máy chơi game.' },
  { code: 29, category: 'goods', title_vi: 'Thịt, cá, gia cầm, sữa, chế phẩm từ sữa, dầu ăn', title_en: 'Meat, fish, poultry, milk, edible oils', description_vi: 'Thịt tươi chế biến, sữa chua, phô mai, dầu thực vật, hạt sấy khô, mứt.' },
  { code: 30, category: 'goods', title_vi: 'Cà phê, trà, ca cao, gạo, bánh kẹo, gia vị', title_en: 'Coffee, tea, cocoa, rice, confectionery, spices', description_vi: 'Hạt cà phê, trà xanh, đường, mì ăn liền, bánh mì, gia vị, nước tương.' },
  { code: 31, category: 'goods', title_vi: 'Nông sản, rau củ quả tươi, hạt giống, thức ăn gia súc', title_en: 'Agricultural, horticultural products, fresh fruits, live animals', description_vi: 'Trái cây tươi, rau củ, cây cảnh, hoa tươi, thức ăn chó mèo.' },
  { code: 32, category: 'goods', title_vi: 'Bia, nước giải khát, nước khoáng, nước trái cây', title_en: 'Beers, non-alcoholic beverages, mineral waters', description_vi: 'Bia, nước ngọt có ga, nước khoáng tinh khiết, nước ép trái cây, nước tăng lực.' },
  { code: 33, category: 'goods', title_vi: 'Đồ uống có cồn (trừ bia)', title_en: 'Alcoholic beverages (except beers)', description_vi: 'Rượu vang, rượu mạnh, vodka, whisky, cognac.' },
  { code: 34, category: 'goods', title_vi: 'Thuốc lá, vật dụng cho người hút thuốc', title_en: 'Tobacco, smokers\' articles, matches', description_vi: 'Thuốc lá, xì gà, thuốc lá điện tử, bật lửa, diêm.' },

  // Dịch vụ (Services 35-45)
  { code: 35, category: 'services', title_vi: 'Quảng cáo, quản lý kinh doanh, mua bán đại lý, bán lẻ', title_en: 'Advertising, business management, retail services', description_vi: 'Dịch vụ quảng cáo, siêu thị, cửa hàng bán lẻ, tư vấn doanh nghiệp, tiếp thị số, nhân sự.' },
  { code: 36, category: 'services', title_vi: 'Tài chính, ngân hàng, bảo hiểm, bất động sản', title_en: 'Financial, banking, insurance, real estate services', description_vi: 'Dịch vụ ngân hàng, cho vay, môi giới bất động sản, đầu tư chứng khoán, bảo hiểm.' },
  { code: 37, category: 'services', title_vi: 'Xây dựng, sửa chữa, lắp đặt thiết bị', title_en: 'Construction, repair, installation services', description_vi: 'Xây dựng nhà cửa, thi công công trình, bảo trì máy móc, dọn dẹp nhà cửa.' },
  { code: 38, category: 'services', title_vi: 'Viễn thông, truyền thông, phát thanh truyền hình', title_en: 'Telecommunications, broadcasting services', description_vi: 'Dịch vụ mạng viễn thông, phát sóng truyền hình, cung cấp truy cập internet, tổng đài.' },
  { code: 39, category: 'services', title_vi: 'Vận tải, đóng gói, kho bãi, du lịch lữ hành', title_en: 'Transport, packaging, storage of goods, travel arrangement', description_vi: 'Vận chuyển hàng hóa, giao hàng nhanh, cho thuê kho, đại lý du lịch, đặt vé máy bay.' },
  { code: 40, category: 'services', title_vi: 'Xử lý vật liệu, dệt nhuộm, gia công cơ khí', title_en: 'Treatment of materials, custom manufacturing', description_vi: 'Gia công may mặc, in ấn bao bì, tái chế rác thải, xử lý bề mặt kim loại.' },
  { code: 41, category: 'services', title_vi: 'Giáo dục, đào tạo, giải trí, thể thao, tổ chức sự kiện', title_en: 'Education, training, entertainment, sporting activities', description_vi: 'Trường học, khóa học trực tuyến, tổ chức sự kiện, dịch vụ phòng tập gym, sản xuất phim.' },
  { code: 42, category: 'services', title_vi: 'Nghiên cứu khoa học, thiết kế CNTT, phát triển phần mềm', title_en: 'Scientific and technological services, IT and software development', description_vi: 'Lập trình phần mềm, thiết kế website, dịch vụ điện toán đám mây, thử nghiệm chất lượng, thiết kế kiến trúc.' },
  { code: 43, category: 'services', title_vi: 'Dịch vụ lưu trú, nhà hàng, khách sạn, quán ăn', title_en: 'Services for providing food and drink, temporary accommodation', description_vi: 'Khách sạn, resort, nhà hàng, quán cà phê, dịch vụ nấu ăn sự kiện, tiệm bánh.' },
  { code: 44, category: 'services', title_vi: 'Dịch vụ y tế, chăm sóc sức khỏe, làm đẹp, nông nghiệp', title_en: 'Medical services, veterinary, beauty care, agriculture', description_vi: 'Bệnh viện, phòng khám, thẩm mỹ viện, chăm sóc thú cưng, tư vấn làm đẹp.' },
  { code: 45, category: 'services', title_vi: 'Dịch vụ pháp lý, đại diện sở hữu trí tuệ, an ninh', title_en: 'Legal services, IP representation, security services', description_vi: 'Tư vấn pháp luật, đại diện đăng ký nhãn hiệu & bằng sáng chế, tư vấn bản quyền, dịch vụ bảo vệ.' }
];

export function getNiceClass(code: number): NiceClassInfo | undefined {
  return NICE_CLASSES.find(c => c.code === code);
}
