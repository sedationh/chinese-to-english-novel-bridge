import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

interface ChineseBook {
  name: string;
  content: Array<{
    
  }>;
}

interface EnglishBook {
  name: string;
  content: string[];
}

function parseChineseBook(filePath: string): ChineseBook {
  // 读取文件内容（假设文件编码为 GBK）
  const buffer = fs.readFileSync(filePath);
  const content = iconv.decode(buffer, "gbk");

  // 获取文件名（不包含扩展名）作为书名
  const name = path.basename(filePath, path.extname(filePath));

  // 按行分割内容，过滤空行和特殊标记
  const lines = content
    .split("\n")
    .map((line: string) => line.trim())
    .filter(
      (line: string) =>
        line.length > 0 &&
        !line.startsWith("==") &&
        !line.includes("http://www.freexiaoshuo.com")
    );

  return {
    name,
    content: lines,
  };
}

// 示例使用
const chineseFilePath = path.join(
  __dirname,
  "../chinese/《超神机械师》（校对版全本）作者：齐佩甲.txt"
);
const chineseBook = parseChineseBook(chineseFilePath);
console.log("Book name:", chineseBook.name);
console.log("Total lines:", chineseBook.content.length);
console.log("First few lines:", chineseBook.content.slice(0, 5));
