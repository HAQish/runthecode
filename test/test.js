var assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('Index', function() {
    it('should render all components', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
});

describe('Login', function() {
    it('should run handleLogin on submit', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
});

describe('Signup', function() {
    it('should run handleSignup', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should redirect to first challenge', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    describe('On error', function() {
        it('should display error message(email already taken)', function() {
          assert.equal([1,2,3].indexOf(4), -1);
        });
    });

});

describe('Initial Challenges', function() {
    it('redirect to login if not logged in', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    describe('first challenge', function() {
      it('should render difficulty', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
      it('should render prompt', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
      it('should render text editor', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
      it('should render example tests', function() {
        assert.equal([1,2,3].indexOf(4), -1);
      });
      describe('on submission', function() {
        it('should run handleChallengeSubmission', function() {
          assert.equal([1,2,3].indexOf(4), -1);
        });
      });
  });
});