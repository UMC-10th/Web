import { memo } from 'react';

interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  console.log('TextInput rended');
  return (
    <input
      type='text'
      className='w-full h-11 bg-[#020806] border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner'
      placeholder="텍스트를 입력하세요..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default memo(TextInput);
