import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Message } from '../../types/discussion';
import { Send, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function DiscussionPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('discussion_author') || '';
  });
  const [isSettingName, setIsSettingName] = useState(!authorName);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('discussions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'discussions' },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authorName.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('discussions').insert([
        {
          author: authorName,
          content: messageContent,
        },
      ]);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('메시지 전송에 실패했습니다.');
    }
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorName.trim()) {
      localStorage.setItem('discussion_author', authorName.trim());
      setIsSettingName(false);
    }
  };

  if (isSettingName) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 card bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-brand-600 dark:text-brand-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">토론방 참여하기</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">사용하실 닉네임을 입력해주세요.</p>
        </div>
        <form onSubmit={handleSaveName} className="space-y-4">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="닉네임 입력..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            시작하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-brand-500" />
            FE 토론방
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">프론트엔드 최신 트렌드에 대해 자유롭게 이야기해보세요.</p>
        </div>
        <button
          onClick={() => setIsSettingName(true)}
          className="text-xs text-slate-400 hover:text-brand-500 transition-colors flex items-center gap-1"
        >
          <User size={12} />
          {authorName} (변경)
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
        >
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-brand-500" size={32} />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <AlertCircle className="text-red-500 mb-2" size={32} />
              <p className="text-slate-700 dark:text-slate-300 font-medium">오류가 발생했습니다</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchMessages}
                className="mt-4 text-brand-600 hover:underline text-sm font-medium"
              >
                다시 시도
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-50">
              <MessageSquare size={48} className="mb-2 text-slate-300" />
              <p className="text-slate-500 dark:text-slate-400">아직 대화가 없습니다.<br />첫 메시지를 남겨보세요!</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.author === authorName ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {msg.author}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ko })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.author === authorName
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
