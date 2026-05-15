import { useState, useRef, useEffect } from 'react';
import { Bell, Check, PartyPopper, MessageSquare, Briefcase, FileText, CircleDollarSign } from 'lucide-react';
import { useNotifications, Notification } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'proposal': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'offer': return <Briefcase className="w-5 h-5 text-emerald-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'payment': return <CircleDollarSign className="w-5 h-5 text-amber-500" />;
      case 'system': return <PartyPopper className="w-5 h-5 text-brand-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[min(400px,80vh)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 flex flex-col items-center">
                <Bell className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm">You have no notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const Wrapper = notification.link ? Link : 'div';
                  return (
                    <Wrapper
                      key={notification.id}
                      to={notification.link || '#'}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-brand-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.createdAt?.toDate ? new Date(notification.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-brand-600 rounded-full mt-2"></div>
                          </div>
                        )}
                      </div>
                    </Wrapper>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
