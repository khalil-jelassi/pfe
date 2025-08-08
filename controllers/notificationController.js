import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query = { read: false };
    
    // For managers, get manager group notifications
    if (role === 'manager' || role === 'Admin_RH') {
      query = { 
        $or: [
          { recipient: 'managers' },
          { recipient: userId }
        ]
      };
    } else {
      // For employees, get only their notifications
      query = { recipient: userId };
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Check if user has permission to mark this notification as read
    if (notification.recipient !== 'managers' && notification.recipient !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark this notification as read'
      });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query = {};
    
    // For managers, mark all manager notifications as read
    if (role === 'manager' || role === 'Admin_RH') {
      query = { 
        $or: [
          { recipient: 'managers' },
          { recipient: userId }
        ],
        read: false
      };
    } else {
      // For employees, mark only their notifications as read
      query = { 
        recipient: userId,
        read: false
      };
    }
    
    await Notification.updateMany(query, { read: true });
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let query = { read: false };
    
    // For managers, count manager group notifications
    if (role === 'manager' || role === 'Admin_RH') {
      query = { 
        $or: [
          { recipient: 'managers' },
          { recipient: userId }
        ],
        read: false
      };
    } else {
      // For employees, count only their notifications
      query = { 
        recipient: userId,
        read: false 
      };
    }
    
    const count = await Notification.countDocuments(query);
      
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};