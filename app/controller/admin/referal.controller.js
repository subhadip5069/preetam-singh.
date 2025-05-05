// referralBonusController.js

const ReferalBonus = require('../../models/refaralbouns'); // Adjust the path as necessary

class ReferralBonusController {


  async getBonus(req, res) {
    try {
      const user = req.user?.id;
      // Retrieve the first referral bonus record.
      const bonus = await ReferalBonus.findOne();
      res.render('admin/refer', { bonus });
    } catch (error) {
     res.redirect('/admin/refer/');
    }
  }

  // POST /referralbonus/update/:id
  async updateBonus(req, res) {
    try {
      const user = req.user?.id;
      const { usercount, referalbonus } = req.body;
      const bonusId = req.params.id;

      // Update the record using updateOne
      await ReferalBonus.updateOne(
        { _id: bonusId },
        { usercount, referalbonus }
      );

      // Retrieve the updated record using findOne
      const updatedBonus = await ReferalBonus.findOne({ _id: bonusId });
      res.redirect('/admin/refer/'); // Redirect to the referral bonus page after updating
    } catch (error) {
     res.redirect('/admin/refer/');
    }
  }
}

// Instantiate controller and bind its methods to the router.


module.exports = new ReferralBonusController();
